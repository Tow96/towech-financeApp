/** shared-features-i18n-nest.module.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Module that handles the i18n library for nest
 */
// Libraries
import * as path from 'path';
import { Module } from '@nestjs/common';
// Services
import { ConfigService } from '@nestjs/config';
import { AcceptLanguageResolver, HeaderResolver } from 'nestjs-i18n';
// Modules
import { I18nModule } from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: 'en',
        fallbacks: {
          'en-*': 'en',
          'es-*': 'es',
        },
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: configService.get('NODE_ENV') === 'development',
        },
      }),
      resolvers: [new HeaderResolver(['lang']), AcceptLanguageResolver],
      inject: [ConfigService],
    }),
  ],
})
export class AuthenticationI18nModule {}
