import './globals.css';
import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import TanstackProvider from '@/utils/TanstackProvider';
import { ToastProvider } from '@/libs/feature-toasts/ToastProvider';

const raleway = Raleway({ subsets: ['latin'], display: 'swap', variable: '--font-raleway' });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
