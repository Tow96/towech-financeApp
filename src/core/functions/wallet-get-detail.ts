import { eq, or } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { WalletDetailDto } from '@/core/dto'

import { GetWalletDetailRequest } from '@/core/dto'
import { FetchWalletMoneySql } from '@/core/utils'

import { db, schema } from '@/database/utils'

export const getWalletDetail = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetWalletDetailRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		logger.info(`User ${userId} requesting detail for wallet ${data.id}`)

		const existingWallet = await db
			.select({
				id: schema.Wallets.id,
				iconId: schema.Wallets.iconId,
				name: schema.Wallets.name,
				money: FetchWalletMoneySql,
				userId: schema.Wallets.userId,
				archivedAt: schema.Wallets.archivedAt,
			})
			.from(schema.Wallets)
			.leftJoin(
				schema.MovementSummary,
				or(
					eq(schema.MovementSummary.originWalletId, schema.Wallets.id),
					eq(schema.MovementSummary.destinationWalletId, schema.Wallets.id),
				),
			)
			.where(eq(schema.Wallets.id, data.id))
			.groupBy(schema.Wallets.id)

		if (existingWallet.length === 0) throw new Response('Wallet not found', { status: 404 })
		if (existingWallet[0].userId !== userId) throw new Response('Unauthorized', { status: 403 })

		const output: WalletDetailDto = {
			id: existingWallet[0].id,
			iconId: existingWallet[0].iconId,
			name: existingWallet[0].name,
			money: parseInt(existingWallet[0].money),
			archived: existingWallet[0].archivedAt !== null,
		}
		return output
	})
