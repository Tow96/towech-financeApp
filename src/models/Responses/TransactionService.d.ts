import Transaction from '../Objects/transaction';
import Wallet from '../Objects/wallet';

export interface ChangeTransactionResponse {
  newTransactions: Transaction[];
  oldTransactions?: Transaction[];
  wallets: Wallet[];
}
