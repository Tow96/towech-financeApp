import { eq, or } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { SetWalletStatusSchema } from './dto'
import type { WalletDetailDto } from '@/features/wallets/queries/detail-wallet/dto'

import { AuthorizationMiddleware } from '@/core/functions'
import { FetchWalletMoneySql } from '@/features/wallets/domain'

import { db, schema } from '@/database'

export const setWalletStatus = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(SetWalletStatusSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		// Checks that wallet exist
		const existingWallet = await db
			.select({
				id: schema.Wallets.id,
				money: FetchWalletMoneySql,
				userId: schema.Wallets.userId,
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

		// Wallet can't be archived unless it has zero money (movements not necessarily 0)
		if (existingWallet[0].money !== '0' && data.archived)
			throw new Response('Wallet needs to have 0 money to be archived', { status: 422 })

		logger.info(`User: ${userId} setting status for wallet: ${data.id}`)

		const updatedWallet = (
			await db
				.update(schema.Wallets)
				.set({ archivedAt: data.archived ? new Date() : null })
				.where(eq(schema.Wallets.id, data.id))
				.returning()
		)[0]

		const output: WalletDetailDto = {
			id: updatedWallet.id,
			iconId: updatedWallet.iconId,
			name: updatedWallet.name,
			money: parseInt(existingWallet[0].money),
			archived: updatedWallet.archivedAt !== null,
		}
		return output
	})
