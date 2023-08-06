/** authentication-core-feature-shell.module.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Main core module for the auth app
 */
// Libraries
import { Module } from '@nestjs/common';
import * as Joi from 'joi';
// Modules
import { AuthenticationFeatureSessionsHttpModule } from '@finance/authentication/feature-sessions/feature-http';
import { AuthenticationSharedFeatureI18nModule } from '@finance/authentication/shared/feature-i18n';
import { AuthenticationSharedDataAccessMongoModule } from '@finance/authentication/shared/data-access-mongo';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
// Misc
import { AuthenticationCoreFeatureShellRoutes } from './shell.routes';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './env',
      isGlobal: true,
      validationSchema: Joi.object({
        // Basic
        NODE_ENV: Joi.string().valid('development', 'production').default('development'),
        PORT: Joi.number().default(3001),
        DISABLE_LOGGING: Joi.boolean().default(false),
        NAME: Joi.string().required(),
        CORS_ORIGIN: Joi.string().required(),
        // DB
        MONGO_URI: Joi.string().required(),
        // Tokens
        AUTH_TOKEN_SECRET: Joi.string().required(),
        AUTH_TOKEN_EXPIRATION: Joi.string().default('1m'),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION: Joi.string().default('30d'),
        REFRESH_SINGLE_TOKEN_EXPIRATION: Joi.string().default('1h'),
      }),
    }),
    // Routes and controllers
    RouterModule.register(AuthenticationCoreFeatureShellRoutes),
    AuthenticationFeatureSessionsHttpModule,
    // Misc
    AuthenticationSharedDataAccessMongoModule,
    AuthenticationSharedFeatureI18nModule,
  ],
})
export class AuthenticationCoreFeatureShellModule {}
