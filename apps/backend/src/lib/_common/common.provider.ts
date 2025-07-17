// External packages
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Internal references
import { CommonSchema } from './common.schemta';

export const COMMON_SCHEMA_CONNECTION = 'COMMON_SCHEMA_CONNECTION';

export const CommonProvider: Provider = {
  provide: COMMON_SCHEMA_CONNECTION,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');
    const pool = new Pool({ connectionString });

    return drizzle(pool, { schema: CommonSchema });
  },
};
