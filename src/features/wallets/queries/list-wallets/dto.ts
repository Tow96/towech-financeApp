import { z } from 'zod'

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

export const GetWalletTotalsSchema = z.object()
