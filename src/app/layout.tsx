import './globals.css';
import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import TanstackProvider from '@/utils/TanstackProvider';
import { ToastProvider } from '@/libs/feature-toasts/ToastProvider';
import { LegacyProvider } from '@/libs/legacyStuff/legacyProvider';

const raleway = Raleway({ subsets: ['latin'], display: 'swap', variable: '--font-raleway' });

export const metadata: Metadata = {
  title: 'Towech Finance App',
  description: 'Application to manage personal finances',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={raleway.className}>
        <LegacyProvider>
          <ToastProvider>
            <TanstackProvider>{children}</TanstackProvider>
          </ToastProvider>
        </LegacyProvider>
      </body>
    </html>
  );
}
