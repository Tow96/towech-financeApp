import { text, timestamp, pgTable, boolean, varchar, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const wallets = pgTable('wallets', {
  id: varchar('id', { length: 24 }).primaryKey(),
  userId: varchar('user_id', { length: 24 }).notNull(),
  iconId: integer('icon_id').notNull().default(0),
  parentId: varchar('parent_id', { length: 24 }),
  name: text('name').notNull(),
  currency: text('currency').notNull().default('MXN'),
  money: integer('money').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deleted: boolean('deleted').notNull().default(false),
});

// TODO error messages
export const insertWalletSchema = createInsertSchema(wallets, {
  name: s => s.name.trim().min(1),
  money: s => s.money.gte(0).transform(() => 0), // Forces a zero since the creation of the transaction will set it properly
  parentId: s => s.parentId.trim(),
}).pick({
  userId: true,
  iconId: true,
  parentId: true,
  name: true,
  currency: true,
  money: true,
});
export const selectWalletSchema = createSelectSchema(wallets);
export type Wallet = z.infer<typeof selectWalletSchema>;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
