import { ReactNode } from 'react';
import { convertAmountToCurrencyString } from '@/lib/utils';

import { Skeleton } from '@/lib/shadcn-ui/components/ui/skeleton';

interface WalletTotalProps {
  total: number;
  loading: boolean;
}

export const WalletTotal = (props: WalletTotalProps): ReactNode => {
  return (
    <span className="flex-1 flex items-center text-2xl">
      Total:{' '}
      {props.loading ? (
        <Skeleton className="w-1/3 h-5 ml-4 mt-1" />
      ) : (
        convertAmountToCurrencyString(props.total)
      )}
    </span>
  );
};
