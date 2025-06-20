import { varchar, integer, timestamp, pgSchema, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const budgetingSchema = pgSchema('budgeting');

export const CategoriesTable = budgetingSchema.table('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id').notNull(),
  iconId: integer('icon_id').notNull(),
  name: varchar('name').notNull(),
  type: varchar('type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const SubCategoriesTable = budgetingSchema.table('sub-categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  parentId: uuid('parent_id'),
  iconId: integer('icon_id').notNull(),
  name: varchar('name').notNull(),
  type: varchar('type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const categoryRelations = relations(CategoriesTable, ({ many }) => ({
  subCategories: many(SubCategoriesTable),
}));

// DrizzleSchema ----------------------------------------
export const BudgetingSchema = {
  categoriesTable: CategoriesTable,
  subCategoriesTable: SubCategoriesTable,
};
