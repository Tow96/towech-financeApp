import type { CategoryType } from './category'

export type Movement = {
	userId: string
	id: string
	date: Date
	amount: number
	description: string
	category: {
		type: CategoryType
		id: string | null
		subId: string | null
	}
	wallet: {
		originId: string | null
		destinationId: string | null
	}
}

