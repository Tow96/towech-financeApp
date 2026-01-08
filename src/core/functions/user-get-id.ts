import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

export const getUserId = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.handler(({ context }) => context.userId)
