// External packages
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Internal references
import { BudgetingSchema } from './budgeting.schema';

export const BUDGETING_SCHEMA_CONNECTION = 'BUDGETING_SCHEMA_CONNECTION';

export const BudgetingProvider: Provider = {
  provide: BUDGETING_SCHEMA_CONNECTION,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');
    const pool = new Pool({ connectionString });

    return drizzle(pool, { schema: BudgetingSchema });
  },
};
