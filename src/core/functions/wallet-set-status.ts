import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { Wallet } from '@/core/domain'
import { SetWalletStatusRequest, mapEntityToWalletDetailDto } from '@/core/dto'

import { WalletRepository } from '@/database/repositories'

export const setWalletStatus = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(SetWalletStatusRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const walletRepo = new WalletRepository()
		logger.info(`User: ${userId} trying to set status of wallet: ${data.id}`)

		const wallet = await walletRepo.get(data.id)
		if (!wallet || wallet.userId !== userId) throw new Response(`Wallet not found`, { status: 404 })

		const updatedWallet: Wallet = {
			...wallet,
			archived: data.archived,
		}
		await walletRepo.update(updatedWallet)
		logger.info(`User: ${userId} set status of wallet: ${data.id} to: ${data.archived}`)

		return mapEntityToWalletDetailDto(updatedWallet)
	})
