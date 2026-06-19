/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useOwnerFinancePageActions } from '../_hooks/useOwnerFinancePageActions';
import { useOwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';
import type { OwnerFinancePageTab } from '../_hooks/owner-finance-page.constants';
import { OwnerFinanceHeaderSection } from '../_sections/OwnerFinanceHeaderSection';
import { OwnerFinanceFiltersSection } from '../_sections/OwnerFinanceFiltersSection';
import { OwnerFinancePortfolioSection } from '../_sections/OwnerFinancePortfolioSection';
import { OwnerFinanceInsightsSection } from '../_sections/OwnerFinanceInsightsSection';
import { OwnerFinancePnlSection } from '../_sections/OwnerFinancePnlSection';
import { OwnerFinanceKpiSection } from '../_sections/OwnerFinanceKpiSection';
import { OwnerFinanceChartsSection } from '../_sections/OwnerFinanceChartsSection';
import { OwnerFinanceWaterfallSection } from '../_sections/OwnerFinanceWaterfallSection';
import { OwnerFinanceTransactionsSection } from '../_sections/OwnerFinanceTransactionsSection';
import { OwnerFinanceExpensesSection } from '../_sections/OwnerFinanceExpensesSection';
import { OwnerFinanceOperationsSection } from '../_sections/OwnerFinanceOperationsSection';
import { ExpenseFormModal } from './ExpenseFormModal';
import { OrderDetailModal } from '../../orders/_components/OrderDetailModal';

interface OwnerFinancePageViewProps {
  pageTab: OwnerFinancePageTab;
}

export function OwnerFinancePageView({ pageTab }: OwnerFinancePageViewProps) {
  const data = useOwnerFinancePageData(pageTab);
  const actions = useOwnerFinancePageActions(data);

  return (
    <>
      <OwnerFinanceHeaderSection data={data} actions={actions} />
      <div className="mt-6 space-y-6">
        <OwnerFinanceFiltersSection data={data} />

        {data.pageTab === 'portfolio' ? (
          <OwnerFinancePortfolioSection data={data} actions={actions} />
        ) : null}

        {data.pageTab === 'finance' ? (
          <>
            <OwnerFinanceInsightsSection data={data} />
            <OwnerFinancePnlSection data={data} />
            <OwnerFinanceWaterfallSection data={data} />
            <OwnerFinanceKpiSection data={data} />
            <OwnerFinanceChartsSection data={data} />
            <OwnerFinanceTransactionsSection data={data} actions={actions} />
            <OwnerFinanceExpensesSection data={data} actions={actions} />
          </>
        ) : null}

        {data.pageTab === 'operations' ? (
          <OwnerFinanceOperationsSection data={data} />
        ) : null}
      </div>
      <ExpenseFormModal data={data} actions={actions} />
      {data.pageTab === 'finance' ? (
        <OrderDetailModal
          orderId={actions.detailOrderId}
          open={Boolean(actions.detailOrderId)}
          onClose={actions.closeOrderDetail}
        />
      ) : null}
    </>
  );
}
