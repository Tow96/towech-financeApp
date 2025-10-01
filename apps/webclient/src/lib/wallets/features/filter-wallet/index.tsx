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
import { cn } from '@/lib/shadcn-ui/utils';
import { capitalizeFirst, convertCentsToCurrencyString } from '@/lib/utils';

interface WalletFilterProps {
  selectedWallet?: string;
  setSelectedWallet?: (s: string) => void;
}

export const WalletFilter = (props: WalletFilterProps): ReactNode => {
  const wallets = useWallets();
  const total = (wallets.data?.map(w => w.money) || []).reduce((acc, v) => acc + v, 0);
  const [selectedWalletId, setSelectedWalletId] = useState<string | undefined>('');

  const handleValueChange = (v: string) => {
    if (props.setSelectedWallet) props.setSelectedWallet(v);
    else setSelectedWalletId(v);
  };

  return (
    <>
      <Select value={props.selectedWallet ?? selectedWalletId} onValueChange={handleValueChange}>
        <SelectTrigger className="!h-16 w-1/2">
          <SelectValue placeholder="pls"></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="total" className="border-b-1 last:border-b-0 py-2">
            <AppIcon id={0} name="Total" className="rounded-full w-12 h-12" />
            <div className="flex flex-1 flex-col min-w-0">
              <span className="text-xl truncate font-bold">Total</span>
              <span
                className={cn(
                  'text-lg',
                  'font-semibold',
                  total < 0 ? 'text-destructive' : 'text-muted-foreground'
                )}>
                {convertCentsToCurrencyString(total)}
              </span>
            </div>
          </SelectItem>

          {wallets.data?.map(wallet => (
            <SelectItem
              key={wallet.id}
              value={wallet.id}
              className="border-b-1 last:border-b-0 py-2">
              <AppIcon
                className={cn('rounded-full w-12 h-12', wallet.archived ? 'opacity-50' : '')}
                id={wallet.iconId}
                name={wallet.name}
              />
              <div
                className={cn('flex flex-1 flex-col min-w-0', wallet.archived ? 'opacity-50' : '')}>
                <span className="text-xl truncate font-bold">{capitalizeFirst(wallet.name)}</span>
                <span
                  className={cn(
                    'text-lg',
                    'font-semibold',
                    wallet.money < 0 ? 'text-destructive' : 'text-muted-foreground'
                  )}>
                  {convertCentsToCurrencyString(wallet.money)}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
