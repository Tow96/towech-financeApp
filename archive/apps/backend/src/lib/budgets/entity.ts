import { mainSchema } from '@/lib/database';

export type BudgetSummaryValueObject = typeof mainSchema.BudgetSummary.$inferSelect;

export type BudgetEntity = typeof mainSchema.Budgets.$inferSelect & {
  summary: BudgetSummaryValueObject[];
};
