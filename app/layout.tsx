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

import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ApolloProvider } from '@/lib/apollo/provider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AUTH_COOKIES } from '@/lib/auth/constants';
import { siteConfig } from '@/config/site';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.companyName} Portal`,
    template: `%s | ${siteConfig.companyName} Portal`,
  },
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read access token from HttpOnly cookie to pass to Apollo Client
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value ?? null;

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="bg-bg text-body min-h-screen font-sans antialiased">
        <ThemeProvider>
          <ApolloProvider accessToken={accessToken}>{children}</ApolloProvider>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
