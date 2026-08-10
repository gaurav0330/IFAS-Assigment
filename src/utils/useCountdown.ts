import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { getRemainingMs, isExpired } from './timer';

/**
 * Ticks once a second while the app is active, but the *value* it produces is
 * always derived from `Date.now()` vs the fixed `endTimestamp` — never from
 * counting ticks. This means:
 * - If the interval is throttled/suspended while backgrounded, we don't drift:
 *   the moment we resume (AppState -> 'active') we immediately recompute from
 *   the real clock.
 * - A force-close/reopen works the same way as long as endTimestamp was
 *   persisted and reloaded before this hook mounts.
 */
export function useCountdown(endTimestamp: number | null, onExpire: () => void) {
  const [remainingMs, setRemainingMs] = useState<number>(
    endTimestamp ? getRemainingMs(endTimestamp) : 0
  );
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const firedRef = useRef(false);

  useEffect(() => {
    if (!endTimestamp) return;
    firedRef.current = false;

    const tick = () => {
      const remaining = getRemainingMs(endTimestamp);
      setRemainingMs(remaining);
      if (isExpired(endTimestamp) && !firedRef.current) {
        firedRef.current = true;
        onExpireRef.current();
      }
    };

    tick(); // recompute immediately on mount / endTimestamp change
    const interval = setInterval(tick, 1000);

    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') tick(); // recompute from real time on resume
    });

    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, [endTimestamp]);

  return remainingMs;
}
