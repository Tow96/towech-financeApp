import { and, desc, eq, gte, lt } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { CategoryType } from '@/core/domain'
import type { ListMovementItemDto } from '@/core/dto'

import { GetMovementListSchema } from '@/core/dto'

import { db, schema } from '@/database/utils'

export const getMovementList = createServerFn({ method: 'GET' })
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
