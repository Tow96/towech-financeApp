'use client';
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@/lib/shadcn-ui/components/ui/card';

import { useWallets } from '@/lib/wallets/data-store';
import { WalletList } from './wallet-list';
import { WalletTotal } from './wallet-total';
import { AddWalletDialog } from './add-wallet-dialog';

export const ManageWalletsView = (): ReactNode => {
  const wallets = useWallets();
  const total = (wallets.data?.map(w => w.money) || []).reduce((acc, v) => acc + v, 0);

  return (
    <Card className="m-4">
      <CardHeader className="flex items-center">
        <WalletTotal total={total} loading={wallets.isLoading} />
        <AddWalletDialog />
      </CardHeader>
      <CardContent>
        <WalletList wallets={wallets.data || []} loading={wallets.isLoading} />
      </CardContent>
    </Card>
  );
};
