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

import type { FinanceReport } from '@/hooks/owner';
import { formatCurrency } from '@/lib/utils';

export type FinanceInsightTone = 'info' | 'warning' | 'success';

export interface FinanceInsight {
  tone: FinanceInsightTone;
  title: string;
  message: string;
}

export function buildFinanceInsights(report: FinanceReport | null): FinanceInsight[] {
  if (!report) return [];

  const insights: FinanceInsight[] = [];
  const { pnl } = report;

  if (
    report.pipelineOrders > 0 &&
    report.completedOrders === 0 &&
    pnl.grossRevenue.value === 0
  ) {
    insights.push({
      tone: 'warning',
      title: 'Có đơn nhưng chưa ghi nhận doanh thu',
      message: `${report.pipelineOrders} đơn đang xử lý (${formatCurrency(report.pipelineGrossValue)}) chưa chuyển sang trạng thái hoàn thành. Doanh thu chỉ ghi nhận khi đơn hoàn thành.`,
    });
  }

  if (pnl.collected.value > pnl.grossRevenue.value && pnl.grossRevenue.value > 0) {
    const advance = pnl.collected.value - pnl.grossRevenue.value;
    insights.push({
      tone: 'info',
      title: 'Đã thu cao hơn doanh thu gộp',
      message: `Chênh lệch ${formatCurrency(advance)} là tiền thu trong kỳ từ đơn chưa hoàn thành hoặc thu trước — không phải lỗi tính toán.`,
    });
  }

  if (report.pendingBookingRevenue > 0) {
    insights.push({
      tone: 'info',
      title: 'Lịch chưa có đơn',
      message: `Dự kiến thêm ${formatCurrency(report.pendingBookingRevenue)} từ lịch chờ chưa tạo đơn hàng.`,
    });
  }

  if (
    report.completedOrders > 0 &&
    pnl.grossRevenue.value > 0 &&
    insights.length === 0
  ) {
    insights.push({
      tone: 'success',
      title: 'Dữ liệu đối soát',
      message: `${report.completedOrders} đơn hoàn thành · doanh thu gộp ${formatCurrency(pnl.grossRevenue.value)} · đã thu ${formatCurrency(pnl.collected.value)}.`,
    });
  }

  return insights;
}
