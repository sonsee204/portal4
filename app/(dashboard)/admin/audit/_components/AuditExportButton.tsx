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

import { useCallback } from 'react';
import { Button } from '@/components/atoms/Button';
import { formatDateTime } from '@/lib/utils';
import { AUDIT } from '@/lib/strings';
import type { AuditLogEntry } from '@/hooks/audit';

interface AuditExportButtonProps {
  logs: AuditLogEntry[];
  disabled?: boolean;
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function AuditExportButton({ logs, disabled }: AuditExportButtonProps) {
  const handleExport = useCallback(() => {
    if (logs.length === 0) return;

    const headers = [
      AUDIT.EXPORT.COLUMNS.ID,
      AUDIT.EXPORT.COLUMNS.ACTOR,
      AUDIT.EXPORT.COLUMNS.ROLE,
      AUDIT.EXPORT.COLUMNS.ACTION,
      AUDIT.EXPORT.COLUMNS.CATEGORY,
      AUDIT.EXPORT.COLUMNS.TARGET,
      AUDIT.EXPORT.COLUMNS.STATUS,
      AUDIT.EXPORT.COLUMNS.IP,
      AUDIT.EXPORT.COLUMNS.TIMESTAMP,
      AUDIT.EXPORT.COLUMNS.ERROR,
    ];

    const rows = logs.map((log) => [
      log._id,
      log.actorName || AUDIT.ACTOR_SYSTEM,
      log.actorRole || '',
      log.action,
      log.category,
      log.target || '',
      log.status,
      log.ip || '',
      formatDateTime(log.createdAt),
      log.errorMessage || '',
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map((row) => row.map(escapeCSV).join(',')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [logs]);

  return (
    <Button
      variant="ghost"
      size="sm"
      iconLeft="download-outline"
      onClick={handleExport}
      disabled={disabled || logs.length === 0}
    >
      Export CSV
    </Button>
  );
}
