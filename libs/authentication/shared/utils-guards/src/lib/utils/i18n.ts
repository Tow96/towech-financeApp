/** utils.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Contains functions that are used by all the library
 */
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

export const validateWithI18n = (
  input: Record<string, any> | false, // eslint-disable-line @typescript-eslint/no-explicit-any
  context: ExecutionContext
): void => {
  if (input === false) {
    const i18n = I18nContext.current(context);
    throw new UnauthorizedException(i18n?.t('validation.INVALID_CREDENTIALS'));
  }
};

export const generateI18nMockExecutionContext = (service: I18nService): ExecutionContext => {
  return {
    getType: () => 'http',
    switchToHttp: () => ({
      getRequest: () => ({
        headers: { lang: 'debug' },
        i18nContext: new I18nContext('debug', service),
      }),
    }),
  } as ExecutionContext;
};
