/** wallets/layout.tsx
 * Copyright (c) 2024, TowechLabs
 *
 * Layout for the wallets page.
 */
// Libraries ------------------------------------------------------------------
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Wallets',
};

const WalletsLayout = ({ children }: { children?: ReactNode }) => children;

export default WalletsLayout;
