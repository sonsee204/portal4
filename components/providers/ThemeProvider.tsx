'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Wraps next-themes ThemeProvider with portal defaults.
 * - attribute="class" adds/removes .dark on <html>
 * - defaultTheme="light" starts in light mode
 * - enableSystem allows OS-level preference
 * - storageKey scoped to portal to avoid cross-app conflicts
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      storageKey="portal-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
