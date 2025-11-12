import { and, desc, eq, gte, lt } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { GetMovementListSchema } from './dto'
import type { ListMovementItemDto } from './dto'
import type { CategoryType } from '@/features/categories/domain'

import { AuthorizationMiddleware } from '@/integrations/clerk'

import { db, schema } from '@/integrations/drizzle-db'

export const getPeriodMovementList = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetMovementListSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		logger.info(
			`user: ${userId} requesting movements for ${data.periodStart.getFullYear()}-${data.periodStart.getMonth() + 1}`,
		)

		const query = await db.query.Movements.findMany({
			with: { summary: true },
			where: and(
				eq(schema.Movements.userId, userId),
				gte(
					schema.Movements.date,
					new Date(data.periodStart.getFullYear(), data.periodStart.getMonth()),
				),
				lt(
					schema.Movements.date,
					new Date(data.periodStart.getFullYear(), data.periodStart.getMonth() + 1),
				), // Primitive handles year rollover
			),
			orderBy: [desc(schema.Movements.date), desc(schema.Movements.createdAt)],
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
