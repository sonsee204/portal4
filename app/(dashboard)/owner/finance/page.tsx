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

import { VenueAction } from '@/graphql/generated';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { EmptyState } from '@/components/molecules/EmptyState';
import { useOwnerFinancePageActions } from './_hooks/useOwnerFinancePageActions';
import { useOwnerFinancePageData } from './_hooks/useOwnerFinancePageData';
import { OwnerFinanceHeaderSection } from './_sections/OwnerFinanceHeaderSection';
import { OwnerFinanceFiltersSection } from './_sections/OwnerFinanceFiltersSection';
import { OwnerFinancePortfolioSection } from './_sections/OwnerFinancePortfolioSection';
import { OwnerFinanceInsightsSection } from './_sections/OwnerFinanceInsightsSection';
import { OwnerFinancePnlSection } from './_sections/OwnerFinancePnlSection';
import { OwnerFinanceKpiSection } from './_sections/OwnerFinanceKpiSection';
import { OwnerFinanceChartsSection } from './_sections/OwnerFinanceChartsSection';
import { OwnerFinanceWaterfallSection } from './_sections/OwnerFinanceWaterfallSection';
import { OwnerFinanceTransactionsSection } from './_sections/OwnerFinanceTransactionsSection';
import { OwnerFinanceExpensesSection } from './_sections/OwnerFinanceExpensesSection';
import { OwnerFinanceOperationsSection } from './_sections/OwnerFinanceOperationsSection';
import { ExpenseFormModal } from './_components/ExpenseFormModal';

function FinancePageContent() {
  const data = useOwnerFinancePageData();
  const actions = useOwnerFinancePageActions(data);

  return (
    <>
      <OwnerFinanceHeaderSection data={data} actions={actions} />
      <div className="mt-6 space-y-6">
        <OwnerFinanceFiltersSection data={data} />

        {data.pageTab === 'portfolio' ? (
          <OwnerFinancePortfolioSection data={data} />
        ) : null}

        {data.pageTab === 'finance' ? (
          <>
            <OwnerFinanceInsightsSection data={data} />
            <OwnerFinancePnlSection data={data} />
            <OwnerFinanceWaterfallSection data={data} />
            <OwnerFinanceKpiSection data={data} />
            <OwnerFinanceChartsSection data={data} />
            <OwnerFinanceTransactionsSection data={data} />
            <OwnerFinanceExpensesSection data={data} actions={actions} />
          </>
        ) : null}

        {data.pageTab === 'operations' ? (
          <OwnerFinanceOperationsSection data={data} />
        ) : null}
      </div>
      <ExpenseFormModal data={data} actions={actions} />
    </>
  );
}

export default function OwnerFinancePage() {
  return (
    <VenueActionGate
      action={VenueAction.ViewAnalytics}
      fallback={
        <div className="py-16">
          <EmptyState
            title="Không có quyền xem tài chính"
            description="Quyền xem thống kê cho phép truy cập báo cáo tài chính và biểu đồ. Liên hệ chủ sân để được cấp quyền."
            icon="lock-closed-outline"
          />
        </div>
      }
    >
      <FinancePageContent />
    </VenueActionGate>
  );
}
