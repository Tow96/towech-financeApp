import { and, eq, or, sql } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import type { ListWalletItemDto, ListWalletsDto } from '@/core/contracts'

import { GetWalletTotalsSchema } from '@/core/contracts'
import { AuthorizationMiddleware } from '@/core/functions'
import { FetchWalletMoneySql } from '@/features/wallets/domain'

import { db, schema } from '@/database'

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
				money: FetchWalletMoneySql,
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
			.where(and(eq(schema.Wallets.userId, userId)))
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
