import { varchar, integer, timestamp, pgSchema, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const distributionSchema = pgSchema('distribution');

export const wallets = distributionSchema.table('wallets', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
  userId: varchar('user_id').notNull(),
  iconId: integer('icon_id').notNull(),
  name: varchar('name').notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const movements = distributionSchema.table('movements', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
  userId: varchar('user_id').notNull(),
  categoryId: varchar('category_id').notNull(),
  description: varchar('description').notNull(),
  date: timestamp('data', { withTimezone: true }).notNull(),
});

export const summary = distributionSchema.table('movement_summary', {
  movementId: uuid('movement_id')
    .notNull()
    .references(() => movements.id),
  originWalletId: uuid('origin_wallet_id').references(() => wallets.id),
  destinationWalletId: uuid('destination_wallet_id').references(() => wallets.id),
  amount: integer('amount').notNull(),
});

export const movementRelations = relations(movements, ({ many }) => ({
  summary: many(summary),
}));

export const summaryRelations = relations(summary, ({ one }) => ({
  parent: one(movements, {
    fields: [summary.movementId],
    references: [movements.id],
  }),
}));

// DrizzleSchema ----------------------------------------
export const DistributionSchema = {
  wallets,
  movements,
  movementRelations,
  summary,
  summaryRelations,
};
