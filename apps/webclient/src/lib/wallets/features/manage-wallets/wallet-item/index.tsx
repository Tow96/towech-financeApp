import { ReactNode } from 'react';
import { AccordionItem, AccordionTrigger } from '@/lib/shadcn-ui/components/ui/accordion';

import { WalletDto } from '@/lib/wallets/data-store';
import { AppIcon } from '@/lib/icons';
import { capitalizeFirst, convertNumToCurrencyString } from '@/lib/utils';
import { cn } from '@/lib/shadcn-ui/utils';
import { Skeleton } from '@/lib/shadcn-ui/components/ui/skeleton';

interface WalletItemProps {
  wallet: WalletDto;
}

export const WalletItem = ({ wallet }: WalletItemProps): ReactNode => {
  return (
    <div className="flex items-center min-w-0 gap-4 py-4 border-b-1 last:border-b-0">
      <AppIcon className="rounded-full w-16 h-16" id={wallet.iconId} name={wallet.name} />

      <div className="flex flex-1 flex-col min-w-0">
        <span className="text-xl truncate font-bold">{capitalizeFirst(wallet.name)}</span>
        <span
          className={cn(
            'text-lg',
            'font-semibold',
            wallet.money < 0 ? 'text-destructive' : 'text-muted-foreground'
          )}>
          {convertNumToCurrencyString(wallet.money)}
        </span>
      </div>
    </div>
  );
};

export const WalletItemSkeleton = (): ReactNode => (
  <div className="flex items-center gap-4 py-4 border-b-1 last:border-b-0">
    <Skeleton className="rounded-full w-16 h-16" />
    <div className="flex-1">
      <Skeleton className="w-2/3 h-4 mb-2" />
      <Skeleton className="w-1/3 h-4" />
    </div>
  </div>
);
