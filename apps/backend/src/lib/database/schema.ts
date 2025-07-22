import { varchar, integer, timestamp, pgSchema, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const MainSchema = pgSchema('main');

export const Categories = MainSchema.table('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id').notNull(),
  iconId: integer('icon_id').notNull(),
  name: varchar('name').notNull(),
  type: varchar('type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
  archivedAt: timestamp('archived_at', { withTimezone: true }),
});

export const SubCategories = MainSchema.table('sub-categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  parentId: uuid('parent_id')
    .references(() => Categories.id)
    .notNull(),
  iconId: integer('icon_id').notNull(),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
  archivedAt: timestamp('archived_at', { withTimezone: true }),
});

export const categoryRelations = relations(Categories, ({ many }) => ({
  subCategories: many(SubCategories),
}));

export const subCategoryRelations = relations(SubCategories, ({ one }) => ({
  parent: one(Categories, {
    fields: [SubCategories.parentId],
    references: [Categories.id],
  }),
}));

export const Wallets = MainSchema.table('wallets', {
  id: uuid('id').defaultRandom().primaryKey(),
  iconId: integer('icon_id').notNull(),
  userId: varchar('user_id').notNull(),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
  archivedAt: timestamp('archived_at', { withTimezone: true }),
});

export const Movements = MainSchema.table('movements', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id').notNull(),
  categoryId: uuid('category_id').notNull(),
  subCategoryId: uuid('sub_category_id'),
  description: varchar('description').notNull(),
  date: timestamp('date', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export const MovementSummary = MainSchema.table('movement_summary', {
  id: uuid('id').defaultRandom().primaryKey(),
  movementId: uuid('movement_id')
    .references(() => Movements.id)
    .notNull(),
  originWalletId: uuid('origin_wallet_id'),
  destinationWalletId: uuid('destination_wallet_id'),
  amount: integer('amount').notNull(),
});

export const movementRelations = relations(Movements, ({ many }) => ({
  summary: many(MovementSummary),
}));

export const summaryRelations = relations(MovementSummary, ({ one }) => ({
  parent: one(Movements, {
    fields: [MovementSummary.movementId],
    references: [Movements.id],
  }),
}));
