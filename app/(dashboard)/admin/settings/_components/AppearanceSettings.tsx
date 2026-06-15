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

import { useTheme } from 'next-themes';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';

const themes = [
  {
    value: 'light',
    label: 'Sáng',
    description: 'Giao diện sáng cho ban ngày',
    icon: 'sunny-outline',
  },
  {
    value: 'dark',
    label: 'Tối',
    description: 'Giao diện tối thân thiện với mắt',
    icon: 'moon-outline',
  },
  {
    value: 'system',
    label: 'Hệ thống',
    description: 'Tự động theo cài đặt thiết bị',
    icon: 'desktop-outline',
  },
] as const;

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <GlassPanel card className="max-w-2xl">
        <h3 className="text-heading mb-4 text-sm font-bold">
          Chế độ giao diện
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <div
              key={t.value}
              className="border-surface-border bg-surface flex flex-col items-center gap-2 rounded-xl border p-4"
            >
              <span className="h-8 w-8" />
              <span className="text-body text-sm font-medium">{t.label}</span>
              <span className="text-faint text-center text-xs">
                {t.description}
              </span>
            </div>
          ))}
        </div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel card className="max-w-2xl">
      <h3 className="text-heading mb-4 text-sm font-bold">Chế độ giao diện</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {themes.map((t) => {
          const isActive = theme === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                isActive
                  ? 'border-primary bg-primary/10 ring-primary/30 ring-2'
                  : 'border-surface-border bg-surface hover:bg-surface-hover'
              )}
            >
              <IonIcon
                name={t.icon}
                size="lg"
                className={isActive ? 'text-primary' : 'text-muted'}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  isActive ? 'text-primary' : 'text-body'
                )}
              >
                {t.label}
              </span>
              <span className="text-faint text-center text-xs">
                {t.description}
              </span>
            </button>
          );
        })}
      </div>
    </GlassPanel>
  );
}
