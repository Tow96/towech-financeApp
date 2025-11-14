import { createStart } from '@tanstack/react-start';

import { loggingMiddleware } from '@/features/logging/http-log.middleware'

import { customClerkMiddleware } from '@/integrations/clerk'

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [customClerkMiddleware(), loggingMiddleware],
  };
});
