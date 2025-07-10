import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { LoadingProvider } from '@/components/providers/loading-provider';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { QueryProvider } from '@/components/providers/query-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Saakie - Premium Indian Sarees',
  description:
    'Discover exquisite Indian sarees for every occasion. From traditional silk to modern designs.',
  keywords: 'sarees, indian sarees, silk sarees, wedding sarees, ethnic wear',
  authors: [{ name: 'Saakie' }],
  openGraph: {
    title: 'Saakie - Premium Indian Sarees',
    description:
      'Discover exquisite Indian sarees for every occasion. From traditional silk to modern designs.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Saakie',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saakie - Premium Indian Sarees',
    description:
      'Discover exquisite Indian sarees for every occasion. From traditional silk to modern designs.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={inter.className}>
      <ClerkProvider>
        <QueryProvider>
          <Suspense>
            <LoadingProvider>
              <LoadingOverlay />
              <Header />
              <main>{children}</main>
            </LoadingProvider>
          </Suspense>
        </QueryProvider>
      </ClerkProvider>
    </body>
  </html>
);

export default RootLayout;
