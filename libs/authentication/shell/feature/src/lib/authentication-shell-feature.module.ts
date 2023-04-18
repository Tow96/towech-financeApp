// Libraries
import * as Joi from 'joi';
import { Module } from '@nestjs/common';
// Modules
import { RouterModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationShellRoutes } from './authentication-shell.routes';
import { AuthenticationHttpSignageModule } from '@towech-finance/authentication/http/signage';
import { SharedFeaturesMongoModule } from '@towech-finance/shared/features/mongo';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './.env',
      isGlobal: true,
      validationSchema: Joi.object({
        // Basic
        NODE_ENV: Joi.string().valid('development', 'production').default('development'),
        PORT: Joi.number().default(3001),
        DISABLE_LOGGING: Joi.boolean().default(false),
        NAME: Joi.string().required(),
        // DB
        MONGO_URI: Joi.string().required(),
      }),
    }),

    RouterModule.register(AuthenticationShellRoutes),

    AuthenticationHttpSignageModule,

    SharedFeaturesMongoModule,
  ],
})
export class AuthenticationShellFeatureModule {}
