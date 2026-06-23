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

import { OwnerFinancePnlSection } from '../OwnerFinancePnlSection';
import type { OwnerFinancePageData } from '../../_hooks/useOwnerFinancePageData';

interface OwnerFinanceOverviewPnlCompactSectionProps {
  data: OwnerFinancePageData;
}

export function OwnerFinanceOverviewPnlCompactSection({
  data,
}: OwnerFinanceOverviewPnlCompactSectionProps) {
  return <OwnerFinancePnlSection data={data} variant="compact" />;
}
