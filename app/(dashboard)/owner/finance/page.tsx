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

import { useOwnerFinancePageActions } from './_hooks/useOwnerFinancePageActions';
import { useOwnerFinancePageData } from './_hooks/useOwnerFinancePageData';
import { OwnerFinanceHeaderSection } from './_sections/OwnerFinanceHeaderSection';
import { OwnerFinanceFiltersSection } from './_sections/OwnerFinanceFiltersSection';
import { OwnerFinanceInsightsSection } from './_sections/OwnerFinanceInsightsSection';
import { OwnerFinancePnlSection } from './_sections/OwnerFinancePnlSection';
import { OwnerFinanceKpiSection } from './_sections/OwnerFinanceKpiSection';
import { OwnerFinanceChartsSection } from './_sections/OwnerFinanceChartsSection';
import { OwnerFinanceTransactionsSection } from './_sections/OwnerFinanceTransactionsSection';
import { OwnerFinanceExpensesSection } from './_sections/OwnerFinanceExpensesSection';
import { ExpenseFormModal } from './_components/ExpenseFormModal';

export default function OwnerFinancePage() {
  const data = useOwnerFinancePageData();
  const actions = useOwnerFinancePageActions(data);

  return (
    <>
      <OwnerFinanceHeaderSection data={data} actions={actions} />
      <div className="mt-6 space-y-6">
        <OwnerFinanceFiltersSection data={data} />
        <OwnerFinanceInsightsSection data={data} />
        <OwnerFinancePnlSection data={data} />
        <OwnerFinanceKpiSection data={data} />
        <OwnerFinanceChartsSection data={data} />
        <OwnerFinanceTransactionsSection data={data} />
        <OwnerFinanceExpensesSection data={data} actions={actions} />
      </div>
      <ExpenseFormModal data={data} actions={actions} />
    </>
  );
}
