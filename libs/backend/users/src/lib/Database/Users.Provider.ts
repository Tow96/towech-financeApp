import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';

import { Pool } from 'pg';
import { UsersSchema } from './Users.Schema';

// Repositories
import { EmailVerificationRepository } from './Repositories/EmailVerification.Repository';
import { PasswordResetRepository } from './Repositories/PasswordReset.Repository';
import { UserInfoRepository } from './Repositories/UserInfo.Repository';

export const USER_SCHEMA_CONNECTION = 'DATABASE_CONNECTION';

export const UserProviders = [
  // DB
  {
    provide: USER_SCHEMA_CONNECTION,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const connectionString = configService.getOrThrow<string>('DATABASE_URL');
      const pool = new Pool({ connectionString });

      return drizzle(pool, { schema: UsersSchema });
    },
  },

  // Repos
  EmailVerificationRepository,
  PasswordResetRepository,
  UserInfoRepository,
];
