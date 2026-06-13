/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * This source code is the intellectual property of Lê Trung Hiếu.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without prior written consent.
 */

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
    .replace(/<svg([^>]*)>/, (_match, attrs: string) => {
      const cleaned = attrs
        .replace(/\s*width="[^"]*"/g, '')
        .replace(/\s*height="[^"]*"/g, '');
      return `<svg${cleaned} fill="currentColor" stroke="currentColor" overflow="visible">`;
    })
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
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        const ct = r.headers.get('content-type') ?? '';
        if (!ct.includes('svg'))
          throw new Error(`unexpected content-type: ${ct}`);
        return r.text();
      })
      .then((text) => {
        if (cancelled) return;
        svgCache.set(name, cleanSvg(text));
        notifySubscribers();
      })
      .catch(() => {
        /* silently ignore — prevents HTML injection if response is not SVG */
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
