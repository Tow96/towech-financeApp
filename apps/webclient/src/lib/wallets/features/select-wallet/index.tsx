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

interface WalletSelectorValue {
  id: string;
  name: string;
  iconId: number;
}

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

  const [selectedWallet, setSelectedWallet] = useState<WalletSelectorValue>(
    value || { id: '', name: '', iconId: 0 }
  );

  const handleOnChange = (id: string) => {
    const wallet = wallets.data?.find(w => w.id === id);
    const value: WalletSelectorValue = {
      id,
      iconId: wallet?.iconId || 0,
      name: wallet?.name || '',
    };

    setSelectedWallet(value);
    onChange(value);
  };

  return (
    <Select disabled={props.disabled} onValueChange={handleOnChange}>
      <SelectTrigger className="w-full !h-12">
        <SelectValue placeholder="Select a wallet">
          <AppIcon id={selectedWallet.iconId} name={setSelectedWallet.name} />
          <span className="text-lg">{selectedWallet.name}</span>
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
