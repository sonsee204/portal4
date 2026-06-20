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
import { Button } from '@/components/atoms/Button';

interface ManualDrawToolbarProps {
  onAutoFill: () => void;
  onClearAll: () => void;
  onSave: () => void;
  canSubmit: boolean;
  saving?: boolean;
}

export function ManualDrawToolbar({
  onAutoFill,
  onClearAll,
  onSave,
  canSubmit,
  saving,
}: ManualDrawToolbarProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    setConfirmClear(false);
    onClearAll();
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm" variant="ghost" onClick={onAutoFill}>
        Điền nhanh còn lại
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleClear}
        className={confirmClear ? 'text-red-400' : undefined}
        onBlur={() => setConfirmClear(false)}
      >
        {confirmClear ? 'Xác nhận xóa hết?' : 'Xóa hết'}
      </Button>
      <Button
        size="sm"
        variant="primary"
        disabled={!canSubmit || saving}
        onClick={onSave}
      >
        {saving ? 'Đang lưu...' : 'Lưu bố cục'}
      </Button>
    </div>
  );
}
