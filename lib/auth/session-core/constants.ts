/** Buffer subtracted from JWT exp when setting cookie maxAge (seconds). */
export const COOKIE_EXPIRY_BUFFER_SECONDS = 30;

/** Fallback when JWT exp cannot be decoded. */
export const DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60;
export const DEFAULT_REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

/**
 * Parse JWT expiration strings like "15m", "7d", "1h" to seconds.
 */
export function parseDurationToSeconds(duration: string): number {
  const match = /^(\d+)([smhd])$/.exec(duration.trim());
  if (!match) {
    return DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS;
  }

  const value = Number.parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      return DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS;
  }
}
