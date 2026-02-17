import { v4 as uuidV4 } from 'uuid'
import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { Wallet } from '@/core/domain'
import { AddWalletRequest, mapEntityToWalletDetailDto } from '@/core/dto'

import { WalletRepository } from '@/database/repositories'

export const addWallet = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(AddWalletRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const walletRepo = new WalletRepository()
		logger.info(`User: ${userId} trying to add wallet with name ${data.name}`)

		// Check if wallet already exists
		if (await walletRepo.existsByName(userId, data.name))
			throw new Response(`Wallet ${data.name} already exists.`, { status: 409 })

		const newWallet: Wallet = {
			userId: userId,
			id: uuidV4(),
			iconId: data.iconId,
			name: data.name,
			archived: false,
			money: 0, // A new wallet is always empty
		}
		await walletRepo.insert(newWallet)

		return mapEntityToWalletDetailDto(newWallet)
	})
