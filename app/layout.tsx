import type { Metadata } from 'next';
import { ApolloProvider } from '@/lib/apollo/provider';
import { siteConfig } from '@/config/site';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.companyName} Portal`,
    template: `%s | ${siteConfig.companyName} Portal`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans text-gray-900 antialiased">
        <ApolloProvider>{children}</ApolloProvider>
      </body>
    </html>
  );
}
