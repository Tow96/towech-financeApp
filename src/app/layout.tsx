import type { Metadata } from 'next';
import 'normalize.css';
import '../index.css';

export const metadata: Metadata = {
  title: 'Towech Finance',
  description: 'Web site created with Next.js.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
