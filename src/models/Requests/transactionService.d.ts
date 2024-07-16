import Wallet from '../Objects/wallet';

export interface WorkerGetTransactions extends Wallet {
  datamonth: string;
}

export interface WorkerTransfer {
  user_id: string;
  from_id: string;
  to_id: string;
  amount: number;
  concept: string;
  transactionDate: Date;
}
