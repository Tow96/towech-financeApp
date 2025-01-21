import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';

import { Pool } from 'pg';
import { UsersSchema } from './Users.Schema';
import { Provider } from '@nestjs/common';

export const USER_SCHEMA_CONNECTION = 'DATABASE_CONNECTION';

export const UserProvider: Provider = {
  provide: USER_SCHEMA_CONNECTION,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');
    const pool = new Pool({ connectionString });

    return drizzle(pool, { schema: UsersSchema });
  },
};
