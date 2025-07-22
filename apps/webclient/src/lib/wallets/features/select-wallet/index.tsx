'use client';
import { ReactNode, useState } from 'react';

import { useWallets, WalletDto } from '@/lib/wallets/data-store';
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

  return (
    <Select disabled={props.disabled}>
      <SelectTrigger className="w-full !h-12">
        <SelectValue placeholder="Select a wallet" />
      </SelectTrigger>
      <SelectContent>
        {wallets.data?.map(wallet => (
          <SelectItem key={wallet.id} value={wallet.id} className="border-b-1 last:border-b-0 py-2">
            <AppIcon id={wallet.iconId} name={wallet.name} />
            <span className="text-lg">{props.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
