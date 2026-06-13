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

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import { FORM_STEPS } from '@/types/tournament-form';

interface FormStepIndicatorProps {
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (step: number) => void;
  /** When set, only these step indices are clickable (e.g. courts-only mode). */
  clickableSteps?: Set<number>;
}

export function FormStepIndicator({
  currentStep,
  completedSteps,
  onStepClick,
  clickableSteps,
}: FormStepIndicatorProps) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [currentStep]);

  return (
    <div className="scrollbar-none -mx-2 flex items-center overflow-x-auto px-2">
      <div className="mx-auto flex items-center">
        {FORM_STEPS.map((step, i) => {
          const isCompleted = completedSteps.has(i);
          const isCurrent = i === currentStep;
          const isClickable = clickableSteps
            ? clickableSteps.has(i)
            : isCompleted || i < currentStep;

          return (
            <div key={i} className="flex shrink-0 items-center">
              {i > 0 && (
                <div
                  className={cn(
                    'mx-0.5 h-px w-4 sm:mx-1 sm:w-6 md:mx-1.5 md:w-8',
                    isCompleted || i <= currentStep
                      ? 'bg-primary'
                      : 'bg-surface-border'
                  )}
                />
              )}

              <button
                ref={isCurrent ? activeRef : undefined}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(i)}
                className={cn(
                  'group flex shrink-0 items-center gap-1 rounded-xl px-1.5 py-1.5 transition-all sm:gap-1.5 sm:px-2 md:px-2.5',
                  isClickable && 'cursor-pointer',
                  !isClickable && !isCurrent && 'cursor-default',
                  isCurrent && 'bg-primary/10'
                )}
              >
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors sm:h-8 sm:w-8',
                    isCompleted
                      ? 'bg-primary text-white'
                      : isCurrent
                        ? 'border-primary bg-primary/20 text-primary border-2'
                        : 'bg-surface border-surface-border text-faint border'
                  )}
                >
                  {isCompleted ? (
                    <IonIcon name="checkmark-outline" size="sm" />
                  ) : (
                    <IonIcon name={step.icon} size="sm" />
                  )}
                </div>

                <span
                  className={cn(
                    'hidden text-xs font-medium whitespace-nowrap md:inline',
                    isCurrent
                      ? 'text-heading'
                      : isCompleted
                        ? 'text-primary group-hover:text-primary-hover'
                        : 'text-faint'
                  )}
                >
                  {step.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
