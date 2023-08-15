/** authentication-core-feature-shell.module.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Main core module for the auth app
 */
// Libraries
import { Module } from '@nestjs/common';
import * as Joi from 'joi';
// Modules
import { AuthenticationSessionsHttpModule } from '@finance/authentication/sessions/http';
import { AuthenticationI18nModule } from '@finance/authentication/shared/i18n';
import { AuthenticationMongoModule } from '@finance/authentication/shared/data-access-mongo';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
// Misc
import { AuthenticationShellRoutes } from './shell.routes';
import { AuthenticationUserHttpModule } from '@finance/authentication/user/http';

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
    RouterModule.register(AuthenticationShellRoutes),
    AuthenticationSessionsHttpModule,
    AuthenticationUserHttpModule,
    // Misc
    AuthenticationMongoModule,
    AuthenticationI18nModule,
  ],
})
export class AuthenticationCoreFeatureShellModule {}
