'use client';

import { useState, useEffect } from 'react';

/**
 * Returns `true` once the component has mounted on the client.
 * Useful for avoiding hydration mismatches with theme-dependent UI.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return mounted;
}
