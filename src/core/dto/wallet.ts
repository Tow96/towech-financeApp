import { z } from 'zod'

import type { Wallet } from '@/core/domain'

// Add ------------------------------------------------------------------------
export const AddWalletRequest = z.object({
	name: z
		.string()
		.min(2, { message: 'Name must be at least 2 characters long.' })
		.max(50, { message: 'Name cannot exceed 50 characters.' })
		.transform(v => v.trim().toLowerCase()),
	iconId: z.number(),
})
export type AddWalletRequest = z.infer<typeof AddWalletRequest>

// Detail ---------------------------------------------------------------------
export type WalletDetailDto = {
	id: string
	iconId: number
	name: string
	money: number
	archived: boolean
}

export const mapEntityToWalletDetailDto = (wallet: Wallet): WalletDetailDto => ({
	id: wallet.id,
	iconId: wallet.iconId,
	name: wallet.name,
	money: wallet.money,
	archived: wallet.archived,
})

export const GetWalletDetailRequest = z.object({
	id: z.uuid(),
})
export type GetWalletDetailRequest = z.infer<typeof GetWalletDetailRequest>

// List -----------------------------------------------------------------------
export type ListWalletItemDto = {
	iconId: number
	id: string
	name: string
	money: number
	archived: boolean
}

export type ListWalletsDto = {
	total: number
	wallets: Array<ListWalletItemDto>
}

export const ListWalletsRequest = z.object()
export type ListWalletsRequest = z.infer<typeof ListWalletsRequest>

// Edit -----------------------------------------------------------------------
export const EditWalletRequest = z.object({
	id: z.uuid(),
	name: z
		.string()
		.min(2, { message: 'Name must be at least 2 characters long.' })
		.max(50, { message: 'Name cannot exceed 50 characters.' })
		.transform(v => v.trim().toLowerCase())
		.optional(),
	iconId: z.number().optional(),
})
export type EditWalletRequest = z.infer<typeof EditWalletRequest>

// Set status -----------------------------------------------------------------
export const SetWalletStatusRequest = z.object({
	id: z.uuid(),
	archived: z.boolean(),
})
export type SetWalletStatusRequest = z.infer<typeof SetWalletStatusRequest>

