'use client';

import { useEffect } from 'react';

/**
 * Initializes Ionicons to load SVGs from our origin (public/svg/) to avoid CORS.
 * Run once on mount so ion-icon elements work without fetching from unpkg.
 */
export function IoniconsInit() {
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      const [{ setAssetPath }, { defineCustomElements }] = await Promise.all([
        import('ionicons'),
        import('ionicons/loader'),
      ]);
      if (cancelled || typeof window === 'undefined') return;
      setAssetPath(`${window.location.origin}/svg/`);
      defineCustomElements(window);
    };
    init();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
