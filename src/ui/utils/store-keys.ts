import type { CategoryType } from '@/core/entities'

export const categoryKeys = {
	all: ['categories'] as const,
	lists: () => [...categoryKeys.all, 'list'] as const,
	list: (type: CategoryType) => [...categoryKeys.lists(), type] as const,
	detail: (type: CategoryType, id: string, subId: string | null) =>
		[...categoryKeys.all, 'detail', type, id, subId] as const,
}

export const movementKeys = {
	all: ['movements'] as const,
	lists: () => [...movementKeys.all, 'list'] as const,
	list: (walletId: string | undefined, start: Date) =>
		[
			...movementKeys.lists(),
			walletId ?? 'total',
			`${start.getFullYear()}-${start.getMonth() + 1}`,
		] as const,
	detail: (id: string) => [...movementKeys.all, 'detail', id] as const,
}

export const walletKeys = {
	all: ['wallets'] as const,
	list: () => [...walletKeys.all, 'list'] as const,
	detail: (id: string) => [...walletKeys.all, 'detail', id] as const,
}

export const graphKeys = {
	all: ['graphs'] as const,
	balance: () => [...graphKeys.all, 'balance'] as const,
}
