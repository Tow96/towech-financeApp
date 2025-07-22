export interface MovementDto {
  id: string;
  categoryId: string;
  date: Date;
  description: string;
  summary: SummaryDto[];
}

export interface SummaryDto {
  originWalletId: string | null;
  destinationWalletId: string | null;
  amount: number;
}

export interface AddMovementDto {
  categoryId: string;
  subCategoryId: string | null;
  date: Date;
  description: string;
  summary: SummaryDto[];
}

export interface EditMovementDto {
  categoryId: string;
  subCategoryId: string | null;
  date: Date;
  description: string;
}
