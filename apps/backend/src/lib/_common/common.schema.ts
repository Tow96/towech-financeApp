import { varchar, integer, timestamp, pgSchema, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const commonSchema = pgSchema('common');

export const CategoriesTable = commonSchema.table('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id').notNull(),
  iconId: integer('icon_id').notNull(),
  name: varchar('name').notNull(),
  type: varchar('type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const SubCategoriesTable = commonSchema.table('sub-categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  parentId: uuid('parent_id').references(() => CategoriesTable.id),
  iconId: integer('icon_id').notNull(),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export const categoryRelations = relations(CategoriesTable, ({ many }) => ({
  subCategories: many(SubCategoriesTable),
}));

export const subCategoryRelations = relations(SubCategoriesTable, ({ one }) => ({
  parent: one(CategoriesTable, {
    fields: [SubCategoriesTable.parentId],
    references: [CategoriesTable.id],
  }),
}));

// DrizzleSchema ----------------------------------------
export const CommonSchema = {
  categoriesTable: CategoriesTable,
  subCategoriesTable: SubCategoriesTable,
  categoryRelations: categoryRelations,
  subCategoryRelations: subCategoryRelations,
};
