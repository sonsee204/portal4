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

import { OwnerFinanceInsightsSection } from '../OwnerFinanceInsightsSection';
import type { OwnerFinancePageData } from '../../_hooks/useOwnerFinancePageData';

interface OwnerFinanceOverviewInsightsSectionProps {
  data: OwnerFinancePageData;
}

export function OwnerFinanceOverviewInsightsSection({
  data,
}: OwnerFinanceOverviewInsightsSectionProps) {
  return <OwnerFinanceInsightsSection data={data} />;
}
