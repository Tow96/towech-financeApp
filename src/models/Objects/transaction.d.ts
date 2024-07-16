import Category from "./category";

export default interface Transaction {
  _id: string;
  user_id: string;
  wallet_id: string;
  transfer_id?: string;
  category: Category;
  concept: string;
  amount: number;
  excludeFromReport?: boolean;
  transactionDate: Date;
  createdAt: Date;
}
