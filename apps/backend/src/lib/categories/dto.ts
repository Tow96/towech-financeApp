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
  archived: boolean;
}

export interface AddCategoryDto {
  name: string;
  type: CategoryType;
  iconId: number;
}

export interface EditCategoryDto {
  name: string;
  iconId: number;
}

export interface AddSubCategoryDto {
  iconId: number;
  name: string;
}

export interface EditSubCategoryDto {
  iconId: number;
  name: string;
}
