'use client';

import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import { iconSizes, type IconSize } from '@/config/theme';

export interface IonIconProps {
  name: string;
  className?: string;
  size?: IconSize;
}

/**
 * Renders a placeholder on server and initial client render, then the real
 * ion-icon after mount. This avoids hydration mismatch because the Ionicons
 * script adds "md hydrated" and role="img" to ion-icon only on the client.
 */
export function IonIcon({ name, className, size = 'md' }: IonIconProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  const classes = cn(iconSizes[size], className);

  if (!mounted) {
    return (
      <span
        className={classes}
        aria-hidden
        style={{ display: 'inline-block', width: '1em', height: '1em' }}
      />
    );
  }

  return React.createElement('ion-icon', { name, class: classes });
}
