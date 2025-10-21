'use client';
import { ReactNode } from 'react';
import { useWallets } from '@/lib/wallets/data-store';

import { AppIcon } from '@/lib/icons';

interface WalletIconProps {
  className?: string;
  id: string;
}

export const WalletIcon = (props: WalletIconProps): ReactNode => {
  const wallets = useWallets();
  const wallet = wallets.data?.find(w => w.id === props.id);

  return (
    <AppIcon className={props.className} name={wallet?.name || 'N/A'} id={wallet?.iconId || 0} />
  );
};
