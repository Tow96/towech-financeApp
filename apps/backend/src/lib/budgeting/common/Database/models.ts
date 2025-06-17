import { BudgetingSchema } from './budgeting.schema';

export type CategoryModel = typeof BudgetingSchema.categoriesTable.$inferSelect;
