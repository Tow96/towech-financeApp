export enum CategoryType {
	income = 'INCOME',
	expense = 'EXPENSE',
	transfer = 'TRANSFER',
}

export type Category = {
	userId: string
	type: CategoryType
	id: string
	subId: string | null
	name: string
	iconId: number
	archived: boolean
}

