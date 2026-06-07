import { MatchStatus } from '@/graphql/generated';

export function isPortalMatchOverdue(
  match: {
    status: MatchStatus;
    scheduledAt?: string | null;
  },
  nowMs = Date.now(),
): boolean {
  if (match.status !== MatchStatus.NotStarted || !match.scheduledAt) {
    return false;
  }
  return new Date(match.scheduledAt).getTime() < nowMs;
}
