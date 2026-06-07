import { cn } from '@/lib/utils';

/** Làm mờ trận không khớp — vừa đủ tương phản, không quá gắt. */
export function scheduleMatchSearchDimClass(active: boolean): string {
  return active
    ? 'opacity-40 saturate-[0.55] transition-opacity duration-200'
    : '';
}

/** Đưa trận khớp lên trên khi các card chồng nhau. */
export function scheduleMatchSearchElevatedClass(active: boolean): string {
  return active ? 'z-20' : 'z-10';
}

/**
 * Viền + glow nhẹ — chỉ box-shadow, không phủ nền, không animation.
 */
export function ScheduleMatchSearchHighlightOverlay({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-20 rounded-xl',
        'shadow-[0_0_0_2px_#7c3aed,0_0_0_5px_rgba(124,58,237,0.14),0_6px_18px_-4px_rgba(124,58,237,0.35)]',
        'dark:shadow-[0_0_0_2px_#a78bfa,0_0_0_5px_rgba(167,139,250,0.18),0_6px_20px_-4px_rgba(124,58,237,0.45)]',
        className
      )}
      aria-hidden
    />
  );
}

export function resolveScheduleSearchHighlight(
  matchId: string,
  highlightedMatchIds: ReadonlySet<string> | undefined,
  dimUnhighlighted = false
): { isHighlighted: boolean; shouldDim: boolean; showOverlay: boolean } {
  const isHighlighted =
    !dimUnhighlighted ||
    !highlightedMatchIds ||
    highlightedMatchIds.has(matchId);
  const shouldDim = Boolean(dimUnhighlighted && !isHighlighted);
  return {
    isHighlighted,
    shouldDim,
    showOverlay: dimUnhighlighted && isHighlighted,
  };
}
