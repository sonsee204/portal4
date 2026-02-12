import type { Metadata } from 'next';
import { ApolloProvider } from '@/lib/apollo/provider';
import { IoniconsInit } from '@/components/IoniconsInit';
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
      <body className="min-h-screen font-sans antialiased">
        <IoniconsInit />
        <ApolloProvider>{children}</ApolloProvider>
      </body>
    </html>
  );
}
