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

import { IonIcon } from '@/components/atoms/IonIcon';
import { Button } from '@/components/atoms/Button';
import type { BulkImportResult } from '@/graphql/generated';

interface ImportStepResultProps {
  result: BulkImportResult;
  onClose: () => void;
}

export function ImportStepResult({ result, onClose }: ImportStepResultProps) {
  const hasErrors = result.errors.length > 0;

  return (
    <div className="space-y-5">
      {/* Summary card */}
      <div className="bg-surface-elevated flex flex-col items-center gap-3 rounded-xl py-8 text-center">
        {result.successCount > 0 ? (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20">
            <IonIcon
              name="checkmark-circle"
              size="xl"
              className="text-green-400"
            />
          </div>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20">
            <IonIcon name="close-circle" size="xl" className="text-red-400" />
          </div>
        )}

        <div>
          <p className="text-heading text-xl font-bold">
            {result.successCount > 0
              ? `Đã import ${result.successCount} VĐV`
              : 'Không import được VĐV nào'}
          </p>
          {hasErrors && (
            <p className="text-secondary mt-1 text-sm">
              {result.failedCount} dòng thất bại — xem chi tiết bên dưới
            </p>
          )}
        </div>

        <div className="flex gap-6 text-sm">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-2xl font-bold text-green-400">
              {result.successCount}
            </span>
            <span className="text-secondary">Thành công</span>
          </div>
          {hasErrors && (
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-2xl font-bold text-red-400">
                {result.failedCount}
              </span>
              <span className="text-secondary">Thất bại</span>
            </div>
          )}
        </div>
      </div>

      {/* Error details */}
      {hasErrors && (
        <div className="overflow-hidden rounded-lg border border-red-500/20">
          <div className="border-b border-red-500/20 bg-red-500/10 px-4 py-2">
            <p className="flex items-center gap-1.5 text-sm font-medium text-red-400">
              <IonIcon name="warning-outline" size="sm" />
              Chi tiết lỗi ({result.failedCount} dòng)
            </p>
          </div>
          <div className="max-h-52 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-surface-elevated sticky top-0">
                <tr className="border-surface-border border-b">
                  <th className="text-secondary w-16 p-2 text-left font-medium">
                    Dòng
                  </th>
                  <th className="text-secondary p-2 text-left font-medium">
                    Tên VĐV
                  </th>
                  <th className="text-secondary p-2 text-left font-medium">
                    Lý do
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.errors.map((err, i) => (
                  <tr
                    key={i}
                    className="border-surface-border border-b last:border-0"
                  >
                    <td className="text-faint p-2 tabular-nums">{err.row}</td>
                    <td className="text-secondary p-2">
                      {err.athleteName || '–'}
                    </td>
                    <td className="p-2 text-red-400">{err.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-1">
        <Button onClick={onClose} iconLeft="close-outline">
          Đóng
        </Button>
      </div>
    </div>
  );
}
