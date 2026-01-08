import { eq, or } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { WalletDetailDto } from '@/core/contracts'

import { EditWalletSchema } from '@/core/contracts'
import { FetchWalletMoneySql } from '@/core/utils'

import { db, schema } from '@/database'

export const editWallet = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(EditWalletSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		// Checks that wallet exist
		const existingWallet = await db
			.select({
				id: schema.Wallets.id,
				money: FetchWalletMoneySql,
				userId: schema.Wallets.userId,
				name: schema.Wallets.name,
				iconId: schema.Wallets.iconId,
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

		logger.info(`User: ${userId} editing wallet: ${data.id}`)
		const updatedWallet = (
			await db
				.update(schema.Wallets)
				.set({
					name: data.name ?? existingWallet[0].name,
					iconId: data.iconId ?? existingWallet[0].iconId,
					updatedAt: new Date(),
				})
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
