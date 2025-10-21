export interface WalletDto {
  id: string;
  iconId: number;
  name: string;
  money: number;
  archived: boolean;
}

export interface AddWalletDto {
  name: string;
  iconId: number;
}

export interface EditWalletDto {
  name: string;
  iconId: number;
}
