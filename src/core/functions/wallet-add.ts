import { and, eq } from 'drizzle-orm'
import { v4 as uuidV4 } from 'uuid'
import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { WalletDetailDto } from '@/core/contracts'

import { AddWalletSchema } from '@/core/contracts'

import { db, schema } from '@/database/utils'

export const addWallet = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(AddWalletSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		logger.info(`User: ${userId} trying to add wallet ${data.name}`)

		// Check if wallet already exists
		const existingWallet = await db
			.select({ id: schema.Wallets.id })
			.from(schema.Wallets)
			.where(and(eq(schema.Wallets.name, data.name), eq(schema.Wallets.userId, userId)))
		if (existingWallet.length > 0)
			throw new Response(`Wallet ${data.name} already exists.`, { status: 409 })

		// Add new wallet to the DB
		const newWallet = (
			await db
				.insert(schema.Wallets)
				.values({
					userId,
					iconId: data.iconId,
					id: uuidV4(),
					name: data.name,
					createdAt: new Date(),
					updatedAt: new Date(0),
				})
				.returning()
		)[0]

		const output: WalletDetailDto = {
			id: newWallet.id,
			iconId: newWallet.iconId,
			name: newWallet.name,
			archived: false,
			money: 0, // A new wallet is always empty
		}
		return output
	})
