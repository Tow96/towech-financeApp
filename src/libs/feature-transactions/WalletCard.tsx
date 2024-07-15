import { Spinner } from '@/components/spinner';
import { IdIcons } from '../legacyStuff/Icons';
import { Wallet } from './Schema';
import { SkeletonComponent } from '@/components/skeleton';

/** WalletCard.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Card that displays the minimum info of a wallet
 */
interface WalletCardProps {
  wallet?: Wallet;
  loading: boolean;
}

// Component ------------------------------------------------------------------
export const WalletCard = ({ wallet, loading }: WalletCardProps): JSX.Element => (
  <li className="mb-4 flex items-center rounded-md bg-riverbed-700 shadow-md">
    <>
      {loading ? (
        <Spinner size="md" className="mx-4 my-3" />
      ) : (
        <IdIcons.Variable iconid={wallet?.iconId ?? 0} className="mx-4 my-3 h-12 w-12" />
      )}
    </>
    <div className="w-0 flex-1">
      <SkeletonComponent
        display={loading}
        className="mr-2 overflow-hidden truncate text-2xl font-bold">
        <span>{wallet?.name}</span>
      </SkeletonComponent>
      <SkeletonComponent display={loading} className="mr-2 text-sm font-semibold text-riverbed-400">
        <span>MXN: {wallet?.money}</span>
      </SkeletonComponent>
    </div>
  </li>
);
