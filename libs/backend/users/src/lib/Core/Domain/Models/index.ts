// Declares the DB models
// Taken from drizzle "breaking" the onion architecture pattern
import { UsersSchema } from '../../../Database/Users.Schema';

export type UserInfoModel = typeof UsersSchema.UserInfoTable.$inferSelect;
export type SessionModel = typeof UsersSchema.SessionTable.$inferSelect;

// Since both email verification and password reset follow the same model a different model is declared here
export type OTPModel = {
  id: string;
  hashedCode: string;
  createdAt: Date;
};

// Model for getting the entire user aggregate from the DB
export type UserModel = {
  info: UserInfoModel;
  email_verification: OTPModel | null;
  password_reset: OTPModel | null;
  sessions: SessionModel[];
};
