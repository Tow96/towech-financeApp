export interface BudgetDto {
  id: string;
  userId: string;
  year: number;
  name: string;
  summary: BudgetSummaryDto[];
}

export interface BudgetSummaryDto {
  month: number;
  categoryId: string;
  subCategoryId: string | null;
  limit: number;
}

export interface AddBudgetDto {
  year: number;
  name: string;
  summary: BudgetSummaryDto[];
}
