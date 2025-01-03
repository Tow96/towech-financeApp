import { Module } from '@nestjs/common';
import { IUserRepository } from '@financeApp/backend-domain';
import { UserRepository } from './User/Repositories/User.Repository';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as userSchema from './User/Schemas/User.Schema';
import { DATABASE_CONNECTION } from './Database.Token';

@Module({
  providers: [
    // Repositories TODO: Maybe move to their own modules or at least config files
    { provide: IUserRepository, useClass: UserRepository },

    // DB Connection TODO: Maybe move to its own module or at least config file
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow('DATABASE_URL'),
        });
        return drizzle(pool, {
          schema: { ...userSchema },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [IUserRepository],
})
export class PersistenceModule {}
