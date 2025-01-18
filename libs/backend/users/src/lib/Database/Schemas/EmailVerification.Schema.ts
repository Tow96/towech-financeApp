import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { UserSchema } from './User.Schema';

export const EmailVerificationSchema = pgTable('email_verification', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => UserSchema.id),
  verificationToken: text('verification_token').notNull(),
  tokenCreatedAt: timestamp('token_created_at', { withTimezone: true }).notNull(),
});
