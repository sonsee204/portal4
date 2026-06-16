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
          className="max-h-[min(70vh,calc(100dvh-15rem))] overflow-auto"
          columns={[
            { key: 'orderCode', label: 'Mã đơn', sortable: true },
            { key: 'completedAt', label: 'Hoàn thành', sortable: true },
            { key: 'orderType', label: 'Loại' },
            { key: 'paymentMethod', label: 'Thanh toán' },
            { key: 'courtLabel', label: 'Sân' },
            { key: 'grossAmount', label: 'Gộp', align: 'right', sortable: true },
            { key: 'netAmount', label: 'Thuần', align: 'right', sortable: true },
          ]}
          data={data.transactions}
          sortKey={data.sortField}
          sortDir={data.sortDir}
          onSort={data.handleSort}
          renderRow={(row: FinanceTransactionNode) => (
            <tr key={row.orderId} className="border-surface-border border-b">
              <td className="text-heading px-4 py-3 text-sm font-semibold">
                {row.orderCode}
                {data.allVenues && row.venueName ? (
                  <p className="text-muted text-xs font-normal">
                    {row.venueName}
                  </p>
                ) : null}
              </td>
              <td className="text-body px-4 py-3 text-sm">
                {row.completedAt
                  ? formatDateTime(row.completedAt)
                  : '—'}
              </td>
              <td className="px-4 py-3">
                <Badge variant="neutral">{row.orderType}</Badge>
              </td>
              <td className="text-body px-4 py-3 text-sm">
                {row.paymentMethod ?? '—'}
              </td>
              <td className="text-body px-4 py-3 text-sm">
                {row.courtLabel ?? '—'}
              </td>
              <td className="text-body px-4 py-3 text-right text-sm">
                {formatCurrency(row.grossAmount)}
              </td>
              <td className="text-heading px-4 py-3 text-right text-sm font-semibold">
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
