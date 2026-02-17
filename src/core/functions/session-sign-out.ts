import { eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import { deleteSessionCookie } from '@/core/utils'

import { db, schema } from '@/database/utils'

export const signOutSession = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.handler(async ({ context: { logger, userId, sessionId } }) => {
		logger.info(`User ${userId} signing out`)

		await db.delete(schema.Sessions).where(eq(schema.Sessions.id, sessionId))
		deleteSessionCookie()
	})
