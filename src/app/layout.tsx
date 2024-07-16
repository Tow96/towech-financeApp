import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import 'normalize.css';
import '../index.css';

export const metadata: Metadata = {
  title: 'Towech Finance',
  description: 'Web site created with Next.js.',
};

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={raleway.className}>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
