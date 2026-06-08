/** Parse ISO `scheduledAt` to local calendar date + HH:mm (stable across browsers). */
export function parseScheduledAtLocal(iso: string): {
  scheduledDate: string;
  startTime: string;
} {
  const d = new Date(iso);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return {
    scheduledDate: `${y}-${mo}-${da}`,
    startTime: `${h}:${mi}`,
  };
}
