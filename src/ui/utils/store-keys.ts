import type { CategoryType } from '@/core/domain'

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
	recentList: () => [...movementKeys.lists(), 'recent'] as const,
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
	balanceWallet: (end: Date) =>
		[...graphKeys.balance(), 'perWallet', end.toISOString().substring(0, 10)] as const,
	balanceTrend: (start: Date, end: Date) =>
		[...graphKeys.balance(), 'trend', start.toISOString(), end.toISOString()] as const,
	cashFlow: () => [...graphKeys.all, 'cash-flow'] as const,
	cashFlowPeriod: (start: Date, end: Date) =>
		[...graphKeys.cashFlow(), start.toISOString(), end.toISOString()] as const,
	cashFlowTrend: (start: Date, end: Date) =>
		[...graphKeys.cashFlow(), 'trend', start.toISOString(), end.toISOString()] as const,
	category: () => [...graphKeys.all, 'category'] as const,
	categoryReport: (start: Date, end: Date) =>
		[...graphKeys.category(), start.toISOString(), end.toISOString()] as const,
}
