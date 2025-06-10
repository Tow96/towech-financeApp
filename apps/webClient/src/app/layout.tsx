import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';

import { TanstackProvider } from '@financeapp/frontend-common';
import { ToastProvider } from '@financeapp/frontend-toasts';

const raleway = Raleway({ subsets: ['latin'], display: 'swap', variable: '--font-raleway' });

export const metadata: Metadata = {
  title: 'Towech Finance App',
  description: 'Application to manage personal finances',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={raleway.className}>
        <ToastProvider>
          <TanstackProvider>{children}</TanstackProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
