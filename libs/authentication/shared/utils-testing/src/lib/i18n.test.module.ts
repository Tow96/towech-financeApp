/** shared-features-i18n-nest-test.module.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Module that handles the i18n library for jest
 */
// Libraries
import { Module } from '@nestjs/common';
// Services
import { AcceptLanguageResolver, HeaderResolver } from 'nestjs-i18n';
// Modules
import { I18nModule } from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'debug',
      loaderOptions: {
        path: __dirname,
      },
      resolvers: [new HeaderResolver(['lang']), AcceptLanguageResolver],
    }),
  ],
})
export class AuthenticationI18nTestingModule {}
