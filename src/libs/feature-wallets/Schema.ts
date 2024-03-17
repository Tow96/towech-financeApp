import { boolean, integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Names ----------------------------------------------------------------------
export enum tableNames {
  WALLETS = 'wallets',
}

// Tables ---------------------------------------------------------------------
export const walletsTable = pgTable(tableNames.WALLETS, {
  id: varchar('id', { length: 24 }).primaryKey(),
  userId: varchar('user_id', { length: 24 }).notNull(),
  iconId: integer('icon_id').notNull().default(0),
  name: varchar('name', { length: 50 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('MXN'),
  money: integer('money').notNull().default(0), // Maybe this should be converted into a sum using a count
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deleted: boolean('deleted').notNull().default(false),
});

// Schemas --------------------------------------------------------------------
export const InsertWallet = createInsertSchema(walletsTable, {
  name: s => s.name.trim(),
  currency: s => s.currency.optional(),
  iconId: s => s.iconId.optional(),
}).pick({
  name: true,
  currency: true,
  iconId: true,
});
export const Wallet = createSelectSchema(walletsTable).omit({ deleted: true });

// Types ----------------------------------------------------------------------
export type Wallet = z.infer<typeof Wallet>;
export type InsertWallet = z.infer<typeof InsertWallet>;
