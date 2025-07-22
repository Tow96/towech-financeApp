export interface MovementDto {
  id: string;
  categoryId: string;
  date: string;
  description: string;
  summary: SummaryDto[];
}

export interface SummaryDto {
  originWalletId: string | null;
  destinationWalletId: string | null;
  amount: number;
}
