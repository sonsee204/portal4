'use client';

import { useCallback } from 'react';
import { Button } from '@/components/atoms/Button';
import type { AuditLog } from '@/types';

interface AuditExportButtonProps {
  logs: AuditLog[];
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
      'ID',
      'Tác nhân',
      'Vai trò',
      'Hành động',
      'Phân loại',
      'Đối tượng',
      'Trạng thái',
      'IP',
      'Thời gian',
      'Lỗi',
    ];

    const rows = logs.map((log) => [
      log._id,
      log.actorName || 'Hệ thống',
      log.actorRole || '',
      log.action,
      log.category,
      log.target || '',
      log.status,
      log.ip || '',
      new Date(log.createdAt).toLocaleString('vi-VN'),
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
