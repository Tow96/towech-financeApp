import { CategoryType } from '@/lib/categories/data-store';

export interface BudgetDto {
  id: string;
  userId: string;
  year: number;
  name: string;
  summary: BudgetSummaryDto[];
}

export interface BudgetSummaryDto {
  month: number;
  limit: number;
  category: {
    type: CategoryType;
    id: string | null;
    subId: string | null;
  };
}
