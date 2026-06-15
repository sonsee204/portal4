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

export interface StepperStep {
  label: string;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn('flex items-center', className)}>
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        return (
          <div key={i} className="flex items-center">
            {i > 0 && (
              <div
                className={cn(
                  'mx-3 h-px w-10 md:w-16',
                  isCompleted ? 'bg-primary' : 'bg-surface-border'
                )}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors',
                  isCompleted
                    ? 'bg-primary text-heading'
                    : isCurrent
                      ? 'bg-primary/20 text-primary border-primary border-2'
                      : 'bg-surface border-surface-border border text-faint'
                )}
              >
                {isCompleted ? (
                  <IonIcon name="checkmark-outline" size="sm" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  'hidden text-sm font-medium md:inline',
                  isCurrent ? 'text-heading' : 'text-faint'
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
