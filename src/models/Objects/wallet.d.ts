export default interface Wallet {
  _id: string;
  user_id: string;
  icon_id: number;
  parent_id: string | undefined;
  child_id: Wallet[] | undefined;
  currency: string;
  name: string;
  money: number | undefined;
  createdAt: Date;
}
