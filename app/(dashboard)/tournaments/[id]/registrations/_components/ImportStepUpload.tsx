'use client';

import { useCallback, useRef, useState } from 'react';
import { IonIcon } from '@/components/atoms/IonIcon';
import { TOURNAMENT } from '@/lib/strings';
import { parseCSV, parseExcel } from '@/lib/utils/registration-import';
import type { ParsedRow } from '@/lib/utils/registration-import';

interface ImportStepUploadProps {
  onParsed: (rows: ParsedRow[]) => void;
  onError: (msg: string) => void;
}

export function ImportStepUpload({ onParsed, onError }: ImportStepUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !['csv', 'xlsx', 'xls'].includes(ext)) {
        onError(
          'Định dạng file không được hỗ trợ. Vui lòng dùng .csv, .xlsx hoặc .xls'
        );
        return;
      }

      setParsing(true);
      try {
        let rows: ParsedRow[];
        if (ext === 'csv') {
          const text = await file.text();
          rows = parseCSV(text);
        } else {
          const buffer = await file.arrayBuffer();
          rows = parseExcel(buffer);
        }

        if (rows.length === 0) {
          onError('File không có dữ liệu. Vui lòng kiểm tra lại.');
          return;
        }
        if (rows.length > 500) {
          onError('File có quá nhiều dòng. Tối đa 500 VĐV mỗi lần import.');
          return;
        }

        onParsed(rows);
      } catch (err) {
        onError(
          err instanceof Error
            ? `${TOURNAMENT.IMPORT_PARSE_ERROR}: ${err.message}`
            : TOURNAMENT.IMPORT_PARSE_ERROR
        );
      } finally {
        setParsing(false);
      }
    },
    [onParsed, onError]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) void processFile(file);
      e.target.value = '';
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) void processFile(file);
    },
    [processFile]
  );

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
          dragging
            ? 'border-primary bg-primary/10'
            : 'border-surface-border bg-surface-elevated hover:border-primary/50 hover:bg-surface-hover'
        }`}
      >
        {parsing ? (
          <div className="border-primary h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" />
        ) : (
          <IonIcon
            name="cloud-upload-outline"
            size="xl"
            className="text-primary"
          />
        )}
        <div>
          <p className="text-heading font-medium">
            {parsing ? 'Đang đọc file...' : TOURNAMENT.IMPORT_DROP_HINT}
          </p>
          <p className="text-secondary mt-1 text-sm">
            {TOURNAMENT.IMPORT_ACCEPT_FORMATS}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Download template */}
      <div className="bg-surface-elevated flex items-center justify-between rounded-lg px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <IonIcon
            name="document-text-outline"
            size="sm"
            className="text-primary"
          />
          <span className="text-secondary">Chưa có file mẫu?</span>
        </div>
        <a
          href="/templates/tournament-registration-template.xlsx"
          download
          className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <IonIcon name="download-outline" size="sm" />
          {TOURNAMENT.IMPORT_DOWNLOAD_TEMPLATE}
        </a>
      </div>

      {/* Column guide */}
      <div className="bg-surface-elevated text-secondary space-y-1 rounded-lg p-4 text-xs">
        <p className="text-heading mb-2 font-medium">Các cột trong file:</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          <span>
            <span className="text-yellow-400">*</span> Tên VĐV
          </span>
          <span>
            <span className="text-yellow-400">*</span> Hạng mục
          </span>
          <span>Số điện thoại</span>
          <span>Email</span>
          <span>Ngày sinh (DD/MM/YYYY)</span>
          <span>CLB / Đội</span>
          <span>Trường</span>
          <span>Tên phụ huynh</span>
          <span>SĐT phụ huynh</span>
          <span>Phí đăng ký (1 VĐV / 2 VĐV cho đôi)</span>
          <span>Ghi chú</span>
        </div>
        <p className="mt-2">
          <span className="text-yellow-400">*</span> Bắt buộc
        </p>
        <p className="text-faint mt-1">
          Lệ phí: nội dung đơn theo 1 VĐV, nội dung đôi theo 2 VĐV (cả đội).
        </p>
      </div>
    </div>
  );
}
