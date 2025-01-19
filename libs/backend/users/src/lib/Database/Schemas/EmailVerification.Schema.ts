import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { UserSchema } from './User.Schema';

export const EmailVerificationSchema = pgTable('email_verification', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => UserSchema.id),
  hashedCode: text('hashed_code').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});
