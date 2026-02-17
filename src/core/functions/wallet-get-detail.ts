import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import { GetWalletDetailRequest, mapEntityToWalletDetailDto } from '@/core/dto'

import { WalletRepository } from '@/database/repositories'

export const getWalletDetail = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetWalletDetailRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const walletRepo = new WalletRepository()
		logger.info(`User ${userId} requesting detail for wallet ${data.id}`)

		const wallet = await walletRepo.get(data.id)
		if (!wallet || wallet.userId !== userId) throw new Response('Wallet not found', { status: 404 })

		return mapEntityToWalletDetailDto(wallet)
	})
