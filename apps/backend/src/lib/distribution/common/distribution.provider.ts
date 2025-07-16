// External package
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Slice references
import { DistributionSchema } from './distribution.schemta';

export const DISTRIBUTION_SCHEMA_CONNECTION = 'DISTRIBUTION_SCHEMA_CONNECTION';

export const DistributionProvider: Provider = {
  provide: DISTRIBUTION_SCHEMA_CONNECTION,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');
    const pool = new Pool({ connectionString });

    return drizzle(pool, { schema: DistributionSchema });
  },
};
