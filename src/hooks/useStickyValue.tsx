import { useRef } from 'react';

/**
 * Maintains a truthy value
 */

export function useStickyValue<T>(value?: T): Maybe<T> {
  const prevRef = useRef<T>();

  if (value !== undefined) {
    prevRef.current = value;
  }

  return prevRef.current;
}
