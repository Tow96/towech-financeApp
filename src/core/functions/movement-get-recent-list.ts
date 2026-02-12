import { and, eq, sql } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { CategoryType } from '@/core/domain'
import type { ListMovementItemDto } from '@/core/dto'

import { db, schema } from '@/database/utils'

export const getRecentMovementList = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.handler(async ({ context: { userId, logger } }) => {
		logger.info(`Fetching recent movements for user: ${userId}`)

		const query = await db.query.Movements.findMany({
			with: { summary: true },
			where: and(eq(schema.Movements.userId, userId)),
			orderBy: sql`GREATEST(${schema.Movements.createdAt}, ${schema.Movements.updatedAt}) DESC`,
			limit: 10,
		})

		const output: Array<ListMovementItemDto> = query.map(x => ({
			id: x.id,
			date: x.date,
			description: x.description,
			amount: x.summary[0].amount,
			category: {
				type: x.categoryType as CategoryType,
				id: x.categoryId,
				subId: x.categorySubId,
			},
			wallet: {
				originId: x.summary[0].originWalletId,
				destinationId: x.summary[0].destinationWalletId,
			},
		}))

		return output
	})
