export enum CategoryType {
	income = 'INCOME',
	expense = 'EXPENSE',
	transfer = 'TRANSFER',
}

export type CategoryDetailDto = {
	iconId: number
	type: CategoryType
	id: string
	subId: string | null
	name: string
	archived: boolean
}
