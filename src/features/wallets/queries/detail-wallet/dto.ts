import { z } from 'zod'

export type WalletDetailDto = {
	id: string
	iconId: number
	name: string
	money: number
	archived: boolean
}

export const GetWalletDetailSchema = z.object({
	id: z.uuid(),
})
export type GetWalletDetailSchema = z.infer<typeof GetWalletDetailSchema>
