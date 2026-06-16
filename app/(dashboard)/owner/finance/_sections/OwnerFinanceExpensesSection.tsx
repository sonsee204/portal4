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
import { Button } from '@/components/atoms/Button';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { VenueAction } from '@/graphql/generated';
import { formatCurrency } from '@/lib/utils';
import {
  FINANCE_TABLE_ROW_CLASS,
  FINANCE_TABLE_SCROLL_CLASS,
} from '@/lib/finance/finance-table';
import { EXPENSE_CATEGORY_LABELS } from '../_hooks/owner-finance-page.constants';
import type { VenueExpenseNode } from '@/hooks/owner';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';
import type { OwnerFinancePageActions } from '../_hooks/useOwnerFinancePageActions';

interface OwnerFinanceExpensesSectionProps {
  data: OwnerFinancePageData;
  actions: OwnerFinancePageActions;
}

export function OwnerFinanceExpensesSection({
  data,
  actions,
}: OwnerFinanceExpensesSectionProps) {
  if (data.allVenues) {
    return (
      <GlassPanel card>
        <p className="text-muted text-sm">
          Quản lý chi phí chỉ khả dụng khi xem theo từng sân. Hãy chọn một sân
          cụ thể để thêm hoặc chỉnh sửa chi phí vận hành.
        </p>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-heading text-base font-bold">Chi phí vận hành</h3>
          <p className="text-muted text-sm">
            {data.expenseCount} khoản chi phí trong kỳ
          </p>
        </div>
        <VenueActionGate action={VenueAction.ManageExpenses}>
          <Button
            size="sm"
            iconLeft="add-outline"
            onClick={actions.openCreateExpense}
            disabled={!data.selectedVenueId}
          >
            Thêm chi phí
          </Button>
        </VenueActionGate>
      </div>

      <QueryState
        loading={data.expensesLoading && data.expenses.length === 0}
        error={data.expensesError}
        empty={!data.selectedVenueId}
        emptyMessage="Chọn sân để quản lý chi phí."
        onRetry={() => void data.refetchExpenses()}
      >
        <DataTable<VenueExpenseNode>
          stickyHeader
          className={FINANCE_TABLE_SCROLL_CLASS}
          emptyTitle="Không có chi phí trong kỳ"
          columns={[
            { key: 'date', label: 'Ngày' },
            { key: 'category', label: 'Nhóm' },
            { key: 'amount', label: 'Số tiền', align: 'right' },
            { key: 'note', label: 'Ghi chú' },
            { key: 'actions', label: '', align: 'right' },
          ]}
          data={data.expenses}
          renderRow={(row: VenueExpenseNode) => (
            <tr key={row._id} className={FINANCE_TABLE_ROW_CLASS}>
              <td className="text-faint px-4 py-3 text-xs">{row.date}</td>
              <td className="text-body px-4 py-3 text-sm">
                {EXPENSE_CATEGORY_LABELS[row.category] ?? row.category}
              </td>
              <td className="px-4 py-3 text-right text-sm font-medium text-emerald-400">
                {formatCurrency(row.amount)}
              </td>
              <td className="text-muted px-4 py-3 text-sm">
                {row.note ?? '—'}
              </td>
              <td className="px-4 py-3 text-right">
                <VenueActionGate action={VenueAction.ManageExpenses}>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => actions.openEditExpense(row)}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => void actions.handleDeleteExpense(row._id)}
                      disabled={actions.deletingExpense}
                    >
                      Xoá
                    </Button>
                  </div>
                </VenueActionGate>
              </td>
            </tr>
          )}
        />

        <ConnectionPager
          loadedCount={data.expenses.length}
          totalCount={data.expenseCount}
          hasNextPage={data.hasMoreExpenses}
          onNext={() => void data.loadMoreExpenses()}
          loading={data.expensesLoading}
        />
      </QueryState>
    </GlassPanel>
  );
}
