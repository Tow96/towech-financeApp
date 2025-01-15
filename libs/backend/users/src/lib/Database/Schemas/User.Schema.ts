import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const UserSchema = pgTable('users', {
  id: text('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),

  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  emailVerified: boolean('email_verified').notNull(),
  passwordHash: text('password_hash').notNull(),
});
