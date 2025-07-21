export interface MovementDto {
  id: string;
  categoryId: string;
  date: Date;
  description: string;
}

export interface AddMovementDto {
  categoryId: string;
  subCategoryId: string | null;
  date: Date;
  description: string;
}

export interface EditMovementDto {
  categoryId: string;
  subCategoryId: string | null;
  date: Date;
  description: string;
}
