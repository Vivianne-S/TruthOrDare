/**
 * Resets the avatar page to the first page when selecting avatar is opened again.
 */
import { useEffect } from "react";

export function useResetWhen<T>(
  condition: boolean,
  initialValue: T,
  setValue: (value: T) => void
) {
  useEffect(() => {
    if (condition) setValue(initialValue);
  }, [condition, initialValue, setValue]);
}
