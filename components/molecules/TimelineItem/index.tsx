'use client';

import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';

export interface TimelineItemProps {
  icon: string;
  iconColor?: string;
  title: string;
  description?: string;
  time: string;
  isLast?: boolean;
  className?: string;
}

export function TimelineItem({
  icon,
  iconColor = 'text-primary bg-primary/20 border-primary/30',
  title,
  description,
  time,
  isLast,
  className,
}: TimelineItemProps) {
  return (
    <div className={cn('flex gap-3', className)}>
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
            iconColor
          )}
        >
          <IonIcon name={icon} size="sm" />
        </div>
        {!isLast && <div className="bg-surface-border mt-1 w-px flex-1" />}
      </div>
      <div className={cn('pb-4', isLast && 'pb-0')}>
        <p className="text-sm text-white">{title}</p>
        {description && (
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        )}
        <p className="mt-0.5 text-xs text-slate-500">{time}</p>
      </div>
    </div>
  );
}
