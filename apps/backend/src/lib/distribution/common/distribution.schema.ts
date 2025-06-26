import { varchar, integer, timestamp, pgSchema, uuid } from 'drizzle-orm/pg-core';

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

// DrizzleSchema ----------------------------------------
export const DistributionSchema = {
  wallets,
};
