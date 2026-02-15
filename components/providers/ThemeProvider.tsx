'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Wraps next-themes ThemeProvider with portal defaults.
 * - attribute="class" adds/removes .dark on <html>
 * - defaultTheme="dark" preserves the current portal look
 * - enableSystem allows OS-level preference
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
