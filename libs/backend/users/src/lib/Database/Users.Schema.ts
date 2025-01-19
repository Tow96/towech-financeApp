import { boolean, pgSchema, text, timestamp } from 'drizzle-orm/pg-core';

// Used to declare the tables
export const schema = pgSchema('users');

export const UserInfoTable = schema.table('info', {
  id: text('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),

  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  emailVerified: boolean('email_verified').notNull(),
  passwordHash: text('password_hash').notNull(),
});

export const EmailVerificationTable = schema.table('email_verification', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => UserInfoTable.id, { onDelete: 'cascade' }),
  hashedCode: text('hashed_code').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});

export const PasswordResetTable = schema.table('password_reset', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => UserInfoTable.id, { onDelete: 'cascade' }),
  hashedCode: text('hashed_code').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});

// Schema used in code
export const UsersSchema = { UserInfoTable, EmailVerificationTable, PasswordResetTable };
