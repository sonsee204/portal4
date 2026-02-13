'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';
import { iconSizes, type IconSize } from '@/config/theme';

export interface IonIconProps {
  name: string;
  className?: string;
  size?: IconSize;
}

/* Module-level cache — persists across navigations, shared by all instances */
const svgCache = new Map<string, string>();
const subscribers = new Set<() => void>();

function subscribe(cb: () => void) {
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}

function notifySubscribers() {
  subscribers.forEach((cb) => cb());
}

/**
 * Replicate what Stencil's icon.css did via inline SVG attributes:
 *   :host           → fill: currentColor
 *   .ionicon        → stroke: currentColor
 *   .ionicon-fill-none    → fill: none
 *   .ionicon-stroke-width → stroke-width: 32px
 *
 * Handles combined classes like `class="ionicon-fill-none ionicon-stroke-width"`.
 */
function cleanSvg(raw: string): string {
  return raw
    .replace(/<\?xml.*?\?>/, '')
    .replace(/<!DOCTYPE[^>]*>/i, '')
    .replace(/\s*width="[^"]*"/, '')
    .replace(/\s*height="[^"]*"/, '')
    .replace(
      /<svg([^>]*)>/,
      '<svg$1 fill="currentColor" stroke="currentColor">'
    )
    .replace(/\s*class="([^"]*)"/g, (_match, classes: string) => {
      const attrs: string[] = [];
      if (classes.includes('ionicon-fill-none')) attrs.push('fill="none"');
      if (classes.includes('ionicon-stroke-width'))
        attrs.push('stroke-width="32"');
      return attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
    });
}

/**
 * Pure React inline SVG icon component.
 * Fetches SVG from /svg/{name}.svg, caches globally, renders inline.
 * No Stencil web component — React controls the entire render.
 */
export function IonIcon({ name, className, size = 'md' }: IonIconProps) {
  const svg = useSyncExternalStore(
    subscribe,
    () => svgCache.get(name) ?? '',
    () => '' // server snapshot — placeholder
  );

  useEffect(() => {
    if (svgCache.has(name)) return;
    let cancelled = false;
    fetch(`/svg/${name}.svg`)
      .then((r) => r.text())
      .then((text) => {
        if (cancelled) return;
        svgCache.set(name, cleanSvg(text));
        notifySubscribers();
      })
      .catch(() => {
        /* silently ignore missing icons */
      });
    return () => {
      cancelled = true;
    };
  }, [name]);

  const classes = cn(
    'inline-flex shrink-0 items-center justify-center [&>svg]:w-full [&>svg]:h-full',
    iconSizes[size],
    className
  );

  if (!svg) {
    return <span className={classes} aria-hidden />;
  }

  return (
    <span
      className={classes}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
