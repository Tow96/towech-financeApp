import { ReactNode } from 'react';
import { Accordion } from '@/lib/shadcn-ui/components/ui/accordion';

import { WalletDto } from '@/lib/wallets/data-store';
import { WalletItem, WalletItemSkeleton } from './wallet-item';

interface WalletListProps {
  wallets: WalletDto[];
  loading: boolean;
}

export const WalletList = ({ wallets, loading }: WalletListProps) => {
  return (
    <Accordion type="single">
      {loading ? (
        <ListSkeleton />
      ) : (
        wallets.map(wallet => <WalletItem key={wallet.id} wallet={wallet} />)
      )}
    </Accordion>
  );
};

export const ListSkeleton = (): ReactNode => {
  return (
    <>
      <WalletItemSkeleton />
      <WalletItemSkeleton />
      <WalletItemSkeleton />
      <WalletItemSkeleton />
      <WalletItemSkeleton />
      <WalletItemSkeleton />
      <WalletItemSkeleton />
    </>
  );
};
