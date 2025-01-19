import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { UsersSchema } from './Users.Schema';
import { ConfigService } from '@nestjs/config';

export const USER_SCHEMA_CONNECTION = 'DATABASE_CONNECTION';

export const UsersProvider = {
  provide: USER_SCHEMA_CONNECTION,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');
    const pool = new Pool({ connectionString });

    return drizzle(pool, { schema: UsersSchema });
  },
};
