/**
 * Timestamp-based countdown helpers.
 *
 * The test session stores a single absolute `endTimestamp` (Date.now() + duration)
 * rather than a "seconds remaining" counter that a setInterval decrements. This
 * means remaining time is always *computed* fresh from Date.now(), so:
 * - Backgrounding/foregrounding the app doesn't drift the timer (a background
 *   setInterval is throttled/paused by the OS, it does NOT fire once per second).
 * - Force-closing and reopening the app is handled the same way: as long as
 *   `endTimestamp` was persisted, remaining time is simply
 *   `endTimestamp - Date.now()` on next load — no special-casing needed.
 */

export function computeEndTimestamp(durationMinutes: number, from: number = Date.now()): number {
  return from + durationMinutes * 60 * 1000;
}

export function getRemainingMs(endTimestamp: number, now: number = Date.now()): number {
  return Math.max(0, endTimestamp - now);
}

export function formatRemaining(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function isExpired(endTimestamp: number, now: number = Date.now()): boolean {
  return now >= endTimestamp;
}
