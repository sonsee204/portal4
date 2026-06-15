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

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import { AUTH } from '@/lib/strings';
import { PASSWORD_MIN_LENGTH } from '@/lib/validation/constants';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

interface Requirement {
  label: string;
  test: (pw: string) => boolean;
}

const REQUIREMENTS: Requirement[] = [
  { label: AUTH.PASSWORD_STRENGTH.MIN_LENGTH(PASSWORD_MIN_LENGTH), test: (pw) => pw.length >= PASSWORD_MIN_LENGTH },
  { label: AUTH.PASSWORD_STRENGTH.HAS_UPPERCASE, test: (pw) => /[A-Z]/.test(pw) },
  { label: AUTH.PASSWORD_STRENGTH.HAS_LOWERCASE, test: (pw) => /[a-z]/.test(pw) },
  { label: AUTH.PASSWORD_STRENGTH.HAS_DIGIT, test: (pw) => /[0-9]/.test(pw) },
];

const STRENGTH_CONFIG = [
  { label: AUTH.PASSWORD_STRENGTH.WEAK, color: 'bg-red-500' },
  { label: AUTH.PASSWORD_STRENGTH.FAIR, color: 'bg-amber-500' },
  { label: AUTH.PASSWORD_STRENGTH.GOOD, color: 'bg-yellow-500' },
  { label: AUTH.PASSWORD_STRENGTH.STRONG, color: 'bg-emerald-500' },
] as const;

function getStrengthIndex(password: string): number {
  if (!password) return -1;
  const passed = REQUIREMENTS.filter((r) => r.test(password)).length;
  return Math.min(passed - 1, STRENGTH_CONFIG.length - 1);
}

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const strengthIndex = useMemo(() => getStrengthIndex(password), [password]);
  const checks = useMemo(
    () => REQUIREMENTS.map((r) => ({ ...r, passed: r.test(password) })),
    [password],
  );

  if (!password) return null;

  const config = strengthIndex >= 0 ? STRENGTH_CONFIG[strengthIndex] : null;

  return (
    <motion.div
      className={cn('space-y-3', className)}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Segmented bar */}
      <div className="space-y-1.5">
        <div className="flex gap-1">
          {STRENGTH_CONFIG.map((seg, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors duration-300',
                i <= strengthIndex ? seg.color : 'bg-surface-border',
              )}
            />
          ))}
        </div>
        {config && (
          <p className={cn('text-xs font-medium', {
            'text-red-400': strengthIndex === 0,
            'text-amber-400': strengthIndex === 1,
            'text-yellow-400': strengthIndex === 2,
            'text-emerald-400': strengthIndex === 3,
          })}>
            {config.label}
          </p>
        )}
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-1.5">
            <IonIcon
              name={check.passed ? 'checkmark-circle' : 'ellipse-outline'}
              size="xs"
              className={cn(
                'shrink-0 transition-colors',
                check.passed ? 'text-emerald-400' : 'text-faint',
              )}
            />
            <span
              className={cn(
                'text-xs transition-colors',
                check.passed ? 'text-body' : 'text-faint',
              )}
            >
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
