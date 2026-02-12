import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import { ListWalletsRequest } from '@/core/dto'

import { WalletRepository } from '@/database/repositories'

export const getWalletList = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(ListWalletsRequest)
	.handler(async ({ context: { userId, logger } }) => {
		const walletRepo = new WalletRepository()
		logger.info(`Fetching all wallets for user ${userId}`)

		return await walletRepo.queryGetAllWallets(userId)
	})
