'use client';
import { ReactNode, useState } from 'react';

import { useWallets } from '@/lib/wallets/data-store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/shadcn-ui/components/ui/select';
import { AppIcon } from '@/lib/icons';
import { Control, useController } from 'react-hook-form';

interface WalletSelectorProps {
  className?: string;
  control?: Control;
  name?: string;
  disabled?: boolean;
}

export const WalletSelector = (props: WalletSelectorProps): ReactNode => {
  const wallets = useWallets();
  const {
    field: { onChange, value },
  } = useController({ name: props.name || '', control: props.control });

  const [displayedWallet, setDisplayedWallet] = useState<{ iconId: number; name: string }>({
    iconId: 0,
    name: '',
  });

  const handleOnChange = (id: string) => {
    onChange(id);

    const wallet = wallets.data?.find(w => w.id === id);
    setDisplayedWallet({ name: wallet?.name || '', iconId: wallet?.iconId || 0 });
  };

  return (
    <Select disabled={props.disabled} onValueChange={handleOnChange}>
      <SelectTrigger className="w-full !h-12">
        <SelectValue placeholder="Select a wallet" defaultValue={value}>
          <AppIcon id={displayedWallet.iconId} name={displayedWallet.name} />
          <span className="text-lg">{displayedWallet.name}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {wallets.data?.map(wallet => (
          <SelectItem key={wallet.id} value={wallet.id} className="border-b-1 last:border-b-0 py-2">
            <AppIcon id={wallet.iconId} name={wallet.name} />
            <span className="text-lg">{wallet.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
