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

import { useMemo } from 'react';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import { DataTable } from '@/components/organisms/DataTable';
import { Badge } from '@/components/atoms/Badge';
import { formatOrderTypeLabel } from '@/lib/constants/order-type';
import { formatPaymentMethodLabel } from '@/lib/constants/payment-method';
import { extractCourtLabelFromBreakdownLabel } from '@/lib/finance/aggregate-court-revenue';
import {
  FINANCE_TABLE_ROW_CLASS,
  FINANCE_TABLE_SCROLL_CLASS,
} from '@/lib/finance/finance-table';
import { getSignedValueClassName } from '@/lib/finance/stat-card-trend';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { buildAmountSummariesFromRows } from '@/lib/data-table/amount-summary';
import { ViewOrderDetailButton } from '../../orders/_components/ViewOrderDetailButton';
import type { FinanceTransactionNode } from '@/hooks/owner';
import type { OwnerFinancePageActions } from '../_hooks/useOwnerFinancePageActions';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';

interface OwnerFinanceTransactionsSectionProps {
  data: OwnerFinancePageData;
  actions: Pick<OwnerFinancePageActions, 'openOrderDetail'>;
}

export function OwnerFinanceTransactionsSection({
  data,
  actions,
}: OwnerFinanceTransactionsSectionProps) {
  const amountSummaries = useMemo(
    () =>
      buildAmountSummariesFromRows(data.transactions, [
        { columnKey: 'grossAmount', getValue: (row) => row.grossAmount },
        {
          columnKey: 'netAmount',
          getValue: (row) => row.netAmount,
          tone: 'positive',
        },
        {
          columnKey: 'profitAmount',
          getValue: (row) => row.profitAmount,
          tone: 'signed',
        },
      ]),
    [data.transactions]
  );

  return (
    <GlassPanel card className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-heading text-base font-bold">
            Giao dịch tài chính
          </h3>
          <p className="text-muted text-sm">
            {data.transactionCount} giao dịch hoàn thành trong kỳ
          </p>
        </div>
      </div>

      <QueryState
        loading={data.transactionsLoading && data.transactions.length === 0}
        error={data.transactionsError}
        empty={!data.allVenues && !data.selectedVenueId}
        emptyMessage="Chọn sân để xem giao dịch."
        onRetry={() => void data.refetchTransactions()}
      >
        <DataTable<FinanceTransactionNode>
          stickyHeader
          className={FINANCE_TABLE_SCROLL_CLASS}
          emptyTitle="Không có giao dịch trong kỳ"
          columns={[
            { key: 'orderCode', label: 'Mã đơn', sortable: true },
            { key: 'completedAt', label: 'Hoàn thành', sortable: true },
            { key: 'orderType', label: 'Loại đơn', align: 'center' },
            { key: 'paymentMethod', label: 'Thanh toán', align: 'center' },
            { key: 'courtLabel', label: 'Sân con' },
            {
              key: 'grossAmount',
              label: 'Doanh thu gộp',
              align: 'right',
              sortable: true,
            },
            {
              key: 'netAmount',
              label: 'Doanh thu thuần',
              align: 'right',
              sortable: true,
            },
            {
              key: 'profitAmount',
              label: 'Lãi',
              align: 'right',
              sortable: true,
            },
            { key: 'actions', label: 'Thao tác', align: 'right' },
          ]}
          data={data.transactions}
          sortKey={data.sortField}
          sortDir={data.sortDir}
          onSort={data.handleSort}
          sortLoading={data.transactionSortLoading}
          amountSummaries={amountSummaries}
          infiniteScroll={{
            loadedCount: data.transactions.length,
            totalCount: data.transactionCount,
            hasNextPage: data.hasMoreTransactions,
            onLoadMore: () => void data.loadMoreTransactions(),
            loading: data.transactionsLoading && data.transactions.length === 0,
            loadingMore: data.isLoadingMoreTransactions,
          }}
          renderRow={(row: FinanceTransactionNode) => (
            <tr key={row.orderId} className={FINANCE_TABLE_ROW_CLASS}>
              <td className="text-body px-4 py-3 font-mono text-sm">
                {row.orderCode}
                {data.allVenues && row.venueName ? (
                  <p className="text-faint font-sans text-xs font-normal">
                    {row.venueName}
                  </p>
                ) : null}
              </td>
              <td className="text-faint px-4 py-3 text-xs">
                {row.completedAt ? formatDateTime(row.completedAt) : '—'}
              </td>
              <td className="px-4 py-3 text-center">
                <Badge variant="neutral">
                  {formatOrderTypeLabel(row.orderType)}
                </Badge>
              </td>
              <td className="text-body px-4 py-3 text-center text-sm">
                {formatPaymentMethodLabel(row.paymentMethod)}
              </td>
              <td className="text-body px-4 py-3 text-sm">
                {row.courtLabel
                  ? extractCourtLabelFromBreakdownLabel(row.courtLabel)
                  : '—'}
              </td>
              <td className="text-body px-4 py-3 text-right text-sm">
                {formatCurrency(row.grossAmount)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-medium text-emerald-400">
                {formatCurrency(row.netAmount)}
              </td>
              <td
                className={`px-4 py-3 text-right text-sm font-medium ${getSignedValueClassName(row.profitAmount)}`}
              >
                <div>{formatCurrency(row.profitAmount)}</div>
                <div
                  className={`text-xs font-normal ${getSignedValueClassName(row.profitMarginPercent)}`}
                >
                  {row.profitMarginPercent.toFixed(1)}%
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <ViewOrderDetailButton
                  orderId={row.orderId}
                  onOpen={actions.openOrderDetail}
                />
              </td>
            </tr>
          )}
        />
      </QueryState>
    </GlassPanel>
  );
}
