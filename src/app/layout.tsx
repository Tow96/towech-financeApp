import type { Metadata } from 'next';
import { AppProvider } from 'src/Services/AppProvider';
import { Raleway } from 'next/font/google';

import 'normalize.css';
import '../index.css';
// TODO: Fix css imports
import '../Components/Page/Page.css';
import '../Components/NavBar/NavBar.css';
import '../Components/NavBar/MenuItem.css';
import './Categories.css';

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
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
