import { and, eq, or, sql } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { GetWalletTotalsSchema, ListWalletItemDto } from './dto'
import type { ListWalletsDto } from './dto'

import { AuthorizationMiddleware } from '@/integrations/clerk'
import { db, schema } from '@/integrations/drizzle-db'

export const getWalletTotals = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetWalletTotalsSchema)
	.handler(async ({ context: { userId, logger } }) => {
		logger.info(`Fetching wallets totals for user ${userId}`)

		const query = await db
			.select({
				iconId: schema.Wallets.iconId,
				id: schema.Wallets.id,
				name: schema.Wallets.name,
				money: sql<string>`
					SUM(CASE WHEN ${schema.MovementSummary.destinationWalletId} = ${schema.Wallets.id} THEN ${schema.MovementSummary.amount} ELSE 0 END)
					- SUM (CASE WHEN ${schema.MovementSummary.originWalletId} = ${schema.Wallets.id} THEN ${schema.MovementSummary.amount} ELSE 0 END)
				`,
				archived: sql<boolean>`CASE WHEN ${schema.Wallets.archivedAt} is NULL THEN FALSE ELSE TRUE END`,
			})
			.from(schema.Wallets)
			.leftJoin(
				schema.MovementSummary,
				or(
					eq(schema.MovementSummary.originWalletId, schema.Wallets.id),
					eq(schema.MovementSummary.destinationWalletId, schema.Wallets.id),
				),
			)
			.leftJoin(schema.Movements, eq(schema.Movements.id, schema.MovementSummary.movementId))
			.where(and(eq(schema.Movements.id, schema.MovementSummary.movementId)))
			.groupBy(schema.Wallets.id)
			.orderBy(schema.Wallets.name)

		let total = 0
		const wallets: Array<ListWalletItemDto> = []
		for (const wallet of query) {
			const money = parseInt(wallet.money)
			total += money
			wallets.push({ ...wallet, money })
		}

		const output: ListWalletsDto = {
			total,
			wallets,
		}
		return output
	})
