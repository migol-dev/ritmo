import { useEffect, RefObject } from 'react';

export function useOutsideClick(ref: RefObject<HTMLElement | null>, callback: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [ref, callback, enabled]);
}
