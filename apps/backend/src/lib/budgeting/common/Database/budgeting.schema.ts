import { varchar, integer, timestamp, pgSchema, uuid } from 'drizzle-orm/pg-core';

export const budgetingSchema = pgSchema('budgeting');

export const CategoriesTable = budgetingSchema.table('categories', {
  id: uuid('id').defaultRandom().unique().notNull(),
  userId: varchar('user_id').notNull(),
  parentId: uuid('parent_id'),
  iconId: integer().notNull(),
  name: varchar('name').notNull(),
  type: varchar('type').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }),
  deletedAt: timestamp('deletedAt', { withTimezone: true }),
});

// DrizzleSchema ----------------------------------------
export const BudgetingSchema = {
  categoriesTable: CategoriesTable,
};
