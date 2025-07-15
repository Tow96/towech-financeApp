export enum CategoryType {
  income = 'INCOME',
  expense = 'EXPENSE',
  transfer = 'TRANSFER',
}

export interface CategoryDto {
  id: string;
  iconId: number;
  name: string;
  type: CategoryType;
  archived: boolean;
  subCategories: SubCategoryDto[];
}

export interface SubCategoryDto {
  id: string;
  iconId: number;
  name: string;
}

export interface AddCategoryDto {
  name: string;
  type: CategoryType;
  iconId: number;
}
