import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

export const MAIN_SCHEMA_CONNECTION = 'MAIN_SCHEMA_CONNECTION';

export const MainProvider: Provider = {
  provide: MAIN_SCHEMA_CONNECTION,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');
    const pool = new Pool({ connectionString });

    return drizzle(pool, { schema });
  },
};
