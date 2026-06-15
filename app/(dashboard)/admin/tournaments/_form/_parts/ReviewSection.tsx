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

import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';

interface ReviewSectionProps {
  icon: string;
  title: string;
  stepIndex: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
  className?: string;
}

export function ReviewSection({
  icon,
  title,
  stepIndex,
  onEdit,
  children,
  className,
}: ReviewSectionProps) {
  return (
    <div className={cn('glass-panel rounded-xl p-5', className)}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <IonIcon name={icon} size="sm" />
          </div>
          <h3 className="text-sm font-bold text-heading">{title}</h3>
        </div>

        <button
          type="button"
          onClick={() => onEdit(stepIndex)}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
        >
          <IonIcon name="create-outline" size="xs" />
          Sửa
        </button>
      </div>

      <div className="space-y-2 text-sm text-body">{children}</div>
    </div>
  );
}

interface ReviewFieldProps {
  label: string;
  value: string | number | undefined;
}

export function ReviewField({ label, value }: ReviewFieldProps) {
  if (!value && value !== 0) return null;

  return (
    <div className="flex items-baseline gap-2">
      <span className="shrink-0 text-muted">{label}:</span>
      <span className="font-medium text-heading">{value}</span>
    </div>
  );
}

interface ReviewListProps {
  items: string[];
}

export function ReviewList({ items }: ReviewListProps) {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) return null;

  return (
    <ul className="list-inside list-disc space-y-0.5 text-body">
      {filtered.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
