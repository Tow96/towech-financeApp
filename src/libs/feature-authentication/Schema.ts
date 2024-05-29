import { boolean, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Names ----------------------------------------------------------------------
export enum tableNames {
  USERS = 'users',
  SESSIONS = 'sessions',
}

// Tables ---------------------------------------------------------------------
export const usersTable = pgTable(tableNames.USERS, {
  id: varchar('id', { length: 24 }).primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  hashedPassword: text('hashed_password').notNull(),
  accountConfirmed: boolean('account_confirmed').notNull().default(false),
  role: text('role', { enum: ['owner', 'admin', 'user'] })
    .notNull()
    .default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deleted: boolean('deleted').notNull().default(false),
});
export const sessionsTable = pgTable(tableNames.SESSIONS, {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  userId: varchar('user_id', { length: 24 }).notNull(),
});

// Schemas --------------------------------------------------------------------
export const insertUserSchema = createInsertSchema(usersTable, {
  email: s => s.email.trim().email(),
  name: s => s.name.trim().min(3),
  role: s => s.role.default('user'),
}).pick({
  name: true,
  email: true,
  role: true,
});
export const selectUserSchema = createSelectSchema(usersTable).omit({
  hashedPassword: true,
  deleted: true,
});
export const Login = z.object({
  email: z.string(),
  password: z.string(),
  keepSession: z.boolean(),
});
// Types ----------------------------------------------------------------------
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
export type Login = z.infer<typeof Login>;
