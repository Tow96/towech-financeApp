import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { Wallet } from '@/core/domain'
import { EditWalletRequest, mapEntityToWalletDetailDto } from '@/core/dto'

import { WalletRepository } from '@/database/repositories'

export const editWallet = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(EditWalletRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const walletRepo = new WalletRepository()

		logger.info(`User: ${userId} trying to edit wallet: ${data.id}`)
		const wallet = await walletRepo.get(data.id)
		if (!wallet || wallet.userId !== userId) throw new Response('Wallet not found', { status: 404 })

		if (data.name && (await walletRepo.existsByName(userId, data.name)))
			throw new Response(`Wallet ${data.name} already exists.`, { status: 409 })

		const updatedWallet: Wallet = {
			...wallet,
			name: data.name ?? wallet.name,
			iconId: data.iconId ?? wallet.iconId,
		}
		await walletRepo.update(updatedWallet)
		logger.info(`User: ${userId} updated wallet: ${data.id}`)

		return mapEntityToWalletDetailDto(updatedWallet)
	})
