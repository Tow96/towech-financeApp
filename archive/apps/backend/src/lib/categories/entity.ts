import { mainSchema } from '@/lib/database';

export type CategoryEntity = typeof mainSchema.Categories.$inferSelect;
export type SubCategoryEntity = typeof mainSchema.SubCategories.$inferSelect;
