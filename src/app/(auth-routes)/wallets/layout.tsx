/** wallets/layout.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Layout for the wallets page.
 */
// Libraries ------------------------------------------------------------------
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wallets',
};

const WalletsLayout = ({ children }: { children?: React.ReactNode }) => children;

export default WalletsLayout;
