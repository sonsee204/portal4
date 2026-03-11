'use client';

import { IonIcon } from '@/components/atoms/IonIcon';
import { Button } from '@/components/atoms/Button';
import { TOURNAMENT } from '@/lib/strings';
import type { ValidatedRow } from '@/lib/utils/registration-import';

interface ImportStepPreviewProps {
  rows: ValidatedRow[];
  onBack: () => void;
  onConfirm: () => void;
  importing: boolean;
}

export function ImportStepPreview({
  rows,
  onBack,
  onConfirm,
  importing,
}: ImportStepPreviewProps) {
  const validCount = rows.filter((r) => r.isValid).length;
  const invalidCount = rows.length - validCount;

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="bg-surface-elevated flex flex-wrap items-center gap-3 rounded-lg px-4 py-3">
        <div className="flex items-center gap-1.5 text-sm">
          <IonIcon
            name="checkmark-circle-outline"
            size="sm"
            className="text-green-400"
          />
          <span className="font-medium text-green-400">
            {validCount} hợp lệ
          </span>
        </div>
        {invalidCount > 0 && (
          <div className="flex items-center gap-1.5 text-sm">
            <IonIcon
              name="warning-outline"
              size="sm"
              className="text-red-400"
            />
            <span className="font-medium text-red-400">{invalidCount} lỗi</span>
            <span className="text-secondary">(sẽ bỏ qua)</span>
          </div>
        )}
        <div className="text-secondary ml-auto text-xs">
          {rows.length} dòng tổng
        </div>
      </div>

      {/* Table */}
      <div className="border-surface-border overflow-x-auto rounded-lg border">
        <table className="w-full text-xs">
          <thead className="bg-surface-elevated">
            <tr className="border-surface-border border-b">
              <th className="text-secondary w-10 p-2 text-left font-medium">
                #
              </th>
              <th className="text-secondary p-2 text-left font-medium">
                Tên VĐV
              </th>
              <th className="text-secondary p-2 text-left font-medium">
                Hạng mục
              </th>
              <th className="text-secondary p-2 text-left font-medium">SĐT</th>
              <th className="text-secondary p-2 text-left font-medium">CLB</th>
              <th className="text-secondary w-40 p-2 text-left font-medium">
                Lỗi
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row._rowIndex}
                className={`border-surface-border border-b last:border-0 ${
                  !row.isValid ? 'bg-red-500/5' : 'hover:bg-white/3'
                }`}
              >
                <td
                  className={`p-2 tabular-nums ${!row.isValid ? 'text-red-400' : 'text-faint'}`}
                >
                  {row._rowIndex}
                </td>
                <td
                  className={`p-2 font-medium ${!row.isValid ? 'text-red-400' : 'text-heading'}`}
                >
                  {row.athleteName || (
                    <span className="text-faint italic">–</span>
                  )}
                </td>
                <td className="text-secondary p-2">
                  {row.resolvedCategoryTitle ?? (
                    <span
                      className={
                        row.isValid ? 'text-secondary' : 'text-red-400'
                      }
                    >
                      {row.categoryName || '–'}
                    </span>
                  )}
                </td>
                <td className="text-secondary p-2">{row.phone || '–'}</td>
                <td className="text-secondary p-2">{row.club || '–'}</td>
                <td className="p-2">
                  {row.errors.length > 0 ? (
                    <ul className="space-y-0.5">
                      {row.errors.map((e, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1 text-red-400"
                        >
                          <span className="mt-0.5 shrink-0">•</span>
                          {e}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <IonIcon
                      name="checkmark-outline"
                      size="sm"
                      className="text-green-400"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <Button
          variant="ghost"
          size="sm"
          iconLeft="arrow-back-outline"
          onClick={onBack}
          disabled={importing}
        >
          Quay lại
        </Button>
        <Button
          size="sm"
          iconLeft="cloud-upload-outline"
          disabled={validCount === 0 || importing}
          onClick={onConfirm}
        >
          {importing ? 'Đang import...' : TOURNAMENT.IMPORT_CONFIRM(validCount)}
        </Button>
      </div>
    </div>
  );
}
