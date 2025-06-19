import { BudgetingSchema } from './budgeting.schema';

export type CategoryModel = typeof BudgetingSchema.categoriesTable.$inferSelect;
export type SubCategoryModel = typeof BudgetingSchema.categoriesTable.$inferSelect;