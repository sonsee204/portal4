/**
 * Accent theo category — dùng chung ScheduleMatchCard & RefereeAssignmentGrid
 * để màu sắc đồng bộ (viền trái + số trận).
 */
export const CATEGORY_SCHEDULE_ACCENTS: {
  border: string;
  dot: string;
  number: string;
}[] = [
    {
      border: 'border-l-violet-500',
      dot: 'bg-violet-500',
      number: 'text-violet-700 dark:text-violet-300',
    },
    {
      border: 'border-l-pink-500',
      dot: 'bg-pink-500',
      number: 'text-pink-700 dark:text-pink-300',
    },
    {
      border: 'border-l-blue-500',
      dot: 'bg-blue-500',
      number: 'text-blue-700 dark:text-blue-300',
    },
    {
      border: 'border-l-amber-500',
      dot: 'bg-amber-500',
      number: 'text-amber-800 dark:text-amber-300',
    },
    {
      border: 'border-l-emerald-500',
      dot: 'bg-emerald-500',
      number: 'text-emerald-700 dark:text-emerald-300',
    },
    {
      border: 'border-l-orange-500',
      dot: 'bg-orange-500',
      number: 'text-orange-700 dark:text-orange-300',
    },
    {
      border: 'border-l-cyan-500',
      dot: 'bg-cyan-500',
      number: 'text-cyan-700 dark:text-cyan-300',
    },
    {
      border: 'border-l-rose-500',
      dot: 'bg-rose-500',
      number: 'text-rose-700 dark:text-rose-300',
    },
  ];

/** Nền + viền giống ô trận trên lưới lịch */
export const SCHEDULE_MATCH_SLOT_SURFACE =
  'bg-surface border-surface-border border border-l-[3px] hover:bg-surface-hover/80 dark:hover:bg-surface-hover/40';

const categoryIndexMap = new Map<string, number>();

export function getCategoryScheduleAccent(categoryId: string) {
  if (!categoryIndexMap.has(categoryId)) {
    categoryIndexMap.set(
      categoryId,
      categoryIndexMap.size % CATEGORY_SCHEDULE_ACCENTS.length
    );
  }
  return CATEGORY_SCHEDULE_ACCENTS[categoryIndexMap.get(categoryId)!];
}
