import { eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import type { UserMenuDto } from '@/features/users/display/dto'

import { AuthorizationMiddleware } from '@/features/sessions/validate'

import { db, schema } from '@/integrations/drizzle-db'

export const getUser = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.handler(async ({ context: { userId, logger } }) => {
		logger.info(`Fetching user data for user: ${userId}`)

		const query = await db
			.select({
				id: schema.Users.id,
				name: schema.Users.name,
				avatarUrl: schema.Users.avatarUrl,
			})
			.from(schema.Users)
			.where(eq(schema.Users.id, userId))

		const response: UserMenuDto = {
			id: query[0].id,
			name: query[0].name,
			avatarUrl: query[0].avatarUrl,
		}

		return response
	})
