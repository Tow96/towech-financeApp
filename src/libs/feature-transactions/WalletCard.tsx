import { Wallet } from './Schema';

/** WalletCard.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Card that displays the minimum info of a wallet
 */
interface WalletCardProps {
  wallet?: Wallet;
}

// Component ------------------------------------------------------------------
export const WalletCard = ({ wallet }: WalletCardProps): JSX.Element => (
  <li>
    <div>{wallet?.iconId}</div>
    <div>
      <div>{wallet?.name}</div>
      <div>{wallet?.money}</div>
    </div>
  </li>
);
