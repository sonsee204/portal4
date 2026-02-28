'use client';

import { useRef, useCallback, type KeyboardEvent, type ClipboardEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { OTP_LENGTH } from '@/lib/validation/constants';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  length?: number;
}

export function OtpInput({
  value,
  onChange,
  disabled,
  error,
  length = OTP_LENGTH,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  const focusInput = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, length - 1));
      inputsRef.current[clamped]?.focus();
    },
    [length],
  );

  const updateValue = useCallback(
    (index: number, digit: string) => {
      const arr = digits.slice();
      arr[index] = digit;
      onChange(arr.join(''));
    },
    [digits, onChange],
  );

  const handleInput = useCallback(
    (index: number, char: string) => {
      if (!/^\d$/.test(char)) return;
      updateValue(index, char);
      if (index < length - 1) focusInput(index + 1);
    },
    [updateValue, focusInput, length],
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (digits[index]) {
          updateValue(index, '');
        } else if (index > 0) {
          updateValue(index - 1, '');
          focusInput(index - 1);
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        focusInput(index - 1);
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        e.preventDefault();
        focusInput(index + 1);
      }
    },
    [digits, updateValue, focusInput, length],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      if (pasted) {
        onChange(pasted.padEnd(length, '').slice(0, length));
        focusInput(Math.min(pasted.length, length - 1));
      }
    },
    [onChange, focusInput, length],
  );

  return (
    <div>
      <div className="flex justify-center gap-2.5">
        {Array.from({ length }).map((_, i) => (
          <motion.input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            disabled={disabled}
            value={digits[i] || ''}
            onChange={(e) => handleInput(i, e.target.value.slice(-1))}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              'bg-surface text-heading flex h-12 w-11 items-center justify-center rounded-lg border text-center text-lg font-bold transition-all',
              'focus-visible:ring-primary/50 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error ? 'border-red-500 focus-visible:ring-red-500' : 'border-surface-border',
              digits[i] && 'border-primary/30',
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-center text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
