/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import * as XLSX from 'xlsx';
import { Button } from '@/components/atoms/Button';
import { downloadCsv } from '@/lib/utils/csv-export';
import type { OwnerProductStatsPageData } from '../_hooks/useOwnerProductStatsPageData';

interface ProductStatsExportButtonProps {
  data: OwnerProductStatsPageData;
}

type ExportRow = {
  nhom: string;
  chi_tieu: string;
  gia_tri: number | string;
};

function buildOverviewRows(data: OwnerProductStatsPageData): ExportRow[] {
  const summary = data.report?.summary;
  if (!summary) return [];

  return [
    { nhom: 'KPI', chi_tieu: 'Doanh thu sản phẩm', gia_tri: summary.totalRevenue },
    { nhom: 'KPI', chi_tieu: 'Lãi gộp', gia_tri: summary.grossProfit },
    { nhom: 'KPI', chi_tieu: 'Biên lãi gộp (%)', gia_tri: summary.grossProfitMarginPercent },
    { nhom: 'KPI', chi_tieu: 'SL đã bán', gia_tri: summary.totalItemsSold },
    { nhom: 'KPI', chi_tieu: 'Đơn có sản phẩm', gia_tri: summary.totalOrders },
    { nhom: 'KPI', chi_tieu: 'SP bán được', gia_tri: summary.uniqueProductsSold },
  ];
}

function buildTableRows(data: OwnerProductStatsPageData): ExportRow[] {
  return data.tableRows.flatMap((row) => [
    {
      nhom: row.productName,
      chi_tieu: 'Doanh thu',
      gia_tri: row.revenue,
    },
    {
      nhom: row.productName,
      chi_tieu: 'SL bán',
      gia_tri: row.soldQuantity,
    },
    {
      nhom: row.productName,
      chi_tieu: 'Lãi gộp',
      gia_tri: row.grossProfit,
    },
  ]);
}

export function ProductStatsExportButton({ data }: ProductStatsExportButtonProps) {
  const handleExport = () => {
    const period = data.report?.period;
    const slug = data.scopeLabel.replace(/\s+/g, '-').toLowerCase();
    const from = period?.from ?? data.dateRange.from;
    const to = period?.to ?? data.dateRange.to;
    const filename = `thong-ke-san-pham-${slug}-${from}-${to}`;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(buildOverviewRows(data)),
      'Tổng quan',
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(buildTableRows(data)),
      'Sản phẩm',
    );

    const topRows = (data.report?.topProducts ?? []).map((item) => ({
      ten: item.productName,
      doanh_thu: item.revenue,
      sl: item.quantitySold,
    }));
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(topRows),
      'Top bán chạy',
    );

    const alertRows = (data.report?.stockAlerts ?? []).map((item) => ({
      ten: item.productName,
      ton: item.currentStock,
      loai: item.alertType,
    }));
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(alertRows),
      'Cảnh báo tồn',
    );

    XLSX.writeFile(workbook, `${filename}.xlsx`);

    downloadCsv(
      `${filename}.csv`,
      buildOverviewRows(data).map((row) => ({
        nhom: row.nhom,
        chi_tieu: row.chi_tieu,
        gia_tri: String(row.gia_tri),
      })),
    );
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      iconLeft="download-outline"
      onClick={handleExport}
      disabled={!data.report}
    >
      Xuất Excel
    </Button>
  );
}
