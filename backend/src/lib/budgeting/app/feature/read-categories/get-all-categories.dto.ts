export interface GetAllCategoriesDto {
  Income: CategoryDto[];
  Expense: CategoryDto[];
}

export interface CategoryDto extends SubcategoryDto {
  subcategories: SubcategoryDto[];
}

export interface SubcategoryDto {
  id: string;
  iconUrl: string;
  name: string;
  archived: boolean;
}
