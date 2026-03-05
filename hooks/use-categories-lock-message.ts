/**
 * Removes the lock message after a delay.
 * Used for auto-deselecting locked categories after showing the lock message.
 */
import { useEffect } from "react";

export function useAutoDeselectAfterDelay<T>(
  watchedId: T | null,
  delayMs: number,
  setValue: (updater: (prev: T | null) => T | null) => void
) {
  useEffect(() => {
    if (!watchedId) return;

    const timeoutId = setTimeout(() => {
      setValue((current) => (current === watchedId ? null : current));
    }, delayMs);

    return () => clearTimeout(timeoutId);
  }, [watchedId, delayMs, setValue]);
}
