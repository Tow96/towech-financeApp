import { and, desc, eq, gte, lt } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import type { CategoryType } from '@/features/categories/domain'
import type { ListMovementItemDto } from '@/core/contracts'

import { GetMovementListSchema } from '@/core/contracts'
import { AuthorizationMiddleware } from '@/core/functions'

import { db, schema } from '@/database'

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

		let output: Array<ListMovementItemDto> = query.map(x => ({
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

		// This filter should be moved to sql
		if (data.walletId && data.walletId !== 'total')
			output = output.filter(
				x => x.wallet.originId === data.walletId || x.wallet.destinationId === data.walletId,
			)

		return output
	})
