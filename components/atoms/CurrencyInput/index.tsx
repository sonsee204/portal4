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

import {
  forwardRef,
  useState,
  useCallback,
  type ChangeEvent,
  type FocusEvent,
} from 'react';
import { Input, type InputProps } from '@/components/atoms/Input';

function parseNumeric(value: string): string {
  return value.replace(/\D/g, '');
}

function formatVND(raw: string): string {
  const digits = parseNumeric(raw);
  if (!digits) return '';
  return Number(digits).toLocaleString('vi-VN');
}

export interface CurrencyInputProps extends Omit<
  InputProps,
  'onChange' | 'value'
> {
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * Input that stores raw numeric string but displays VND-formatted value.
 * On focus: shows raw digits for easy editing.
 * On blur: formats with thousand separators (e.g. "50000" -> "50.000").
 * Suffix "đ" shown via placeholder convention.
 */
const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    { value = '', onChange, onFocus, onBlur, placeholder = '0đ', ...props },
    ref
  ) => {
    const [editing, setEditing] = useState(false);

    const displayValue = editing
      ? parseNumeric(value)
      : value
        ? formatVND(value)
        : '';

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const raw = parseNumeric(e.target.value);
        onChange?.(raw);
      },
      [onChange]
    );

    const handleFocus = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        setEditing(true);
        onFocus?.(e);
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        setEditing(false);
        onBlur?.(e);
      },
      [onBlur]
    );

    return (
      <Input
        ref={ref}
        {...props}
        value={displayValue ? `${displayValue}${editing ? '' : 'đ'}` : ''}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        inputMode="numeric"
        leftIcon="cash-outline"
      />
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput };
