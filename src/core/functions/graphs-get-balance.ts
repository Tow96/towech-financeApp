import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

export const getBalanceGraph = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.handler(async ({ context: { userId, logger } }) => {
		logger.info(`User ${userId} requesting balance chart from: to: `)

		return [
			{ date: new Date('2026-01-18'), balance: 186 },
			{ date: new Date('2026-01-19'), balance: 305 },
			{ date: new Date('2026-01-20'), balance: 237 },
			{ date: new Date('2026-01-21'), balance: 73 },
			{ date: new Date('2026-01-22'), balance: 209 },
			{ date: new Date('2026-01-23'), balance: 214 },
			{ date: new Date('2026-01-24'), balance: 214 },
		]
	})

