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

import { useState } from 'react';
import { useSystemStats } from '@/hooks/admin';
import { useAuditLogs } from '@/hooks/audit';
import { RECENT_LOGS_LIMIT } from './dashboard-page.constants';

export function useDashboardPageData() {
  const [period, setPeriod] = useState('daily');

  const { stats, loading, error, refetch } = useSystemStats();
  const { logs: recentLogs } = useAuditLogs({
    pagination: { page: 1, limit: RECENT_LOGS_LIMIT },
  });

  return {
    period,
    setPeriod,
    stats,
    loading,
    error,
    refetch,
    recentLogs,
  };
}

export type DashboardPageData = ReturnType<typeof useDashboardPageData>;
