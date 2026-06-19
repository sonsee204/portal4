/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * This source code is the intellectual property of Lê Trung Hiếu.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without prior written consent.
 */

'use client';

import * as XLSX from 'xlsx';
import { Button } from '@/components/atoms/Button';
import { downloadCsv } from '@/lib/utils/csv-export';
import type { FinanceTransactionNode, VenueExpenseNode } from '@/hooks/owner';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';

interface FinanceExportButtonProps {
  data: OwnerFinancePageData;
}

type FinanceExportRow = {
  nhom: string;
  chi_tieu: string;
  gia_tri: number | string;
};

function buildPortfolioExportRows(
  data: OwnerFinancePageData
): FinanceExportRow[] {
  const venues = data.portfolio?.venues ?? [];
  if (venues.length === 0) return [];

  return venues.flatMap((venue) => [
    {
      nhom: venue.venueName,
      chi_tieu: 'Doanh thu gộp',
      gia_tri: venue.grossRevenue.value,
    },
    {
      nhom: venue.venueName,
      chi_tieu: 'Lãi ròng',
      gia_tri: venue.netProfit.value,
    },
    {
      nhom: venue.venueName,
      chi_tieu: 'Biên LN ròng (%)',
      gia_tri: venue.netMarginPercent.value,
    },
    {
      nhom: venue.venueName,
      chi_tieu: 'Lợi nhuận gộp',
      gia_tri: venue.grossProfit.value,
    },
    {
      nhom: venue.venueName,
      chi_tieu: 'Đơn hoàn thành',
      gia_tri: venue.completedOrders,
    },
  ]);
}

function buildFinanceExportRows(
  data: OwnerFinancePageData
): FinanceExportRow[] {
  const report = data.report;
  if (!report) return [];

  return [
    {
      nhom: 'P&L',
      chi_tieu: 'Doanh thu thuần',
      gia_tri: report.pnl.netRevenue.value,
    },
    { nhom: 'P&L', chi_tieu: 'Giá vốn', gia_tri: report.pnl.cogs.value },
    {
      nhom: 'P&L',
      chi_tieu: 'Lợi nhuận gộp',
      gia_tri: report.pnl.grossProfit.value,
    },
    {
      nhom: 'P&L',
      chi_tieu: 'Chi phí vận hành',
      gia_tri: report.pnl.operatingExpenses.value,
    },
    {
      nhom: 'P&L',
      chi_tieu: 'Lãi/lỗ ròng',
      gia_tri: report.pnl.netProfit.value,
    },
    { nhom: 'Chỉ số', chi_tieu: 'Đã thu', gia_tri: report.pnl.collected.value },
    {
      nhom: 'Chỉ số',
      chi_tieu: 'Còn phải thu',
      gia_tri: report.pnl.outstanding.value,
    },
    {
      nhom: 'Chỉ số',
      chi_tieu: 'Hoàn tiền',
      gia_tri: report.pnl.refunds.value,
    },
    { nhom: 'Chỉ số', chi_tieu: 'Tổng đơn', gia_tri: report.totalOrders },
    { nhom: 'Chỉ số', chi_tieu: 'Hoàn thành', gia_tri: report.completedOrders },
    ...report.trend.map((point) => ({
      nhom: 'Xu hướng',
      chi_tieu: point.label,
      gia_tri: point.revenue,
    })),
    ...data.transactions.map((tx: FinanceTransactionNode) => ({
      nhom: 'Giao dịch',
      chi_tieu: tx.orderCode,
      gia_tri: tx.netAmount,
    })),
    ...data.expenses.map((expense: VenueExpenseNode) => ({
      nhom: 'Chi phí',
      chi_tieu: expense.category,
      gia_tri: expense.amount,
    })),
  ];
}

function buildExportRows(data: OwnerFinancePageData): FinanceExportRow[] {
  if (data.pageTab === 'portfolio') {
    if (data.allVenues) {
      return buildPortfolioExportRows(data);
    }
    const portfolioRows = buildPortfolioExportRows(data);
    const reportRows = buildFinanceExportRows(data);
    return portfolioRows.length > 0 ? portfolioRows : reportRows;
  }

  return buildFinanceExportRows(data);
}

function buildExportFilename(
  data: OwnerFinancePageData,
  extension: 'csv' | 'xlsx'
) {
  const tabSlug =
    data.pageTab === 'portfolio'
      ? 'tong-quan'
      : data.pageTab === 'operations'
        ? 'van-hanh'
        : 'tai-chinh';
  const slug = data.allVenues
    ? 'tat-ca-san'
    : (data.selectedVenue?.name?.replace(/\s+/g, '-').toLowerCase() ?? 'venue');

  return `${tabSlug}-${slug}-${data.dateRange.from}-${data.dateRange.to}.${extension}`;
}

function canExport(data: OwnerFinancePageData): boolean {
  if (data.pageTab === 'portfolio') {
    if (data.allVenues) {
      return (data.portfolio?.venues.length ?? 0) > 0;
    }
    return Boolean(data.report) || (data.portfolio?.venues.length ?? 0) > 0;
  }
  return Boolean(data.report);
}

export function FinanceExportButton({ data }: FinanceExportButtonProps) {
  const exportEnabled = canExport(data);

  const handleExportCsv = () => {
    const rows = buildExportRows(data);
    if (rows.length === 0) return;
    downloadCsv(buildExportFilename(data, 'csv'), rows);
  };

  const handleExportExcel = () => {
    const rows = buildExportRows(data);
    if (rows.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      data.pageTab === 'portfolio' ? 'Tổng quan' : 'Tài chính'
    );
    XLSX.writeFile(workbook, buildExportFilename(data, 'xlsx'));
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        iconLeft="download-outline"
        onClick={handleExportCsv}
        disabled={!exportEnabled}
      >
        CSV
      </Button>
      <Button
        variant="ghost"
        size="sm"
        iconLeft="document-outline"
        onClick={handleExportExcel}
        disabled={!exportEnabled}
      >
        Excel
      </Button>
    </div>
  );
}
