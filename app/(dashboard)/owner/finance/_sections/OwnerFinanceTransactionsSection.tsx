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

import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import { ConnectionPager } from '@/components/molecules/ConnectionPager';
import { DataTable } from '@/components/organisms/DataTable';
import { Badge } from '@/components/atoms/Badge';
import { formatOrderTypeLabel } from '@/lib/constants/order-type';
import { formatPaymentMethodLabel } from '@/lib/constants/payment-method';
import {
  FINANCE_TABLE_ROW_CLASS,
  FINANCE_TABLE_SCROLL_CLASS,
} from '@/lib/finance/finance-table';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { FinanceTransactionNode } from '@/hooks/owner';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';

interface OwnerFinanceTransactionsSectionProps {
  data: OwnerFinancePageData;
}

export function OwnerFinanceTransactionsSection({
  data,
}: OwnerFinanceTransactionsSectionProps) {
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
            { key: 'courtLabel', label: 'Sân / khung giờ' },
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
          ]}
          data={data.transactions}
          sortKey={data.sortField}
          sortDir={data.sortDir}
          onSort={data.handleSort}
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
                {row.courtLabel ?? '—'}
              </td>
              <td className="text-body px-4 py-3 text-right text-sm">
                {formatCurrency(row.grossAmount)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-medium text-emerald-400">
                {formatCurrency(row.netAmount)}
              </td>
            </tr>
          )}
        />

        <ConnectionPager
          loadedCount={data.transactions.length}
          totalCount={data.transactionCount}
          hasNextPage={data.hasMoreTransactions}
          onNext={() => void data.loadMoreTransactions()}
          loading={data.transactionsLoading}
        />
      </QueryState>
    </GlassPanel>
  );
}
