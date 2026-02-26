'use client';

import { useTheme } from 'next-themes';
import { useMounted } from '@/hooks/useMounted';
import { IonIcon } from '@/components/atoms/IonIcon';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

/**
 * Sun / Moon toggle button for switching between light and dark themes.
 * Renders a placeholder on the server to avoid hydration mismatch.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <button
        className={cn(
          'text-muted hover:bg-surface-hover hover:text-heading flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
          className
        )}
        aria-label="Chuyển đổi giao diện"
      >
        <span className="h-5 w-5" />
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'text-muted hover:bg-surface-hover hover:text-heading flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
        className
      )}
      title={
        isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'
      }
      aria-label="Chuyển đổi giao diện"
    >
      <IonIcon name={isDark ? 'sunny-outline' : 'moon-outline'} size="md" />
    </button>
  );
}
