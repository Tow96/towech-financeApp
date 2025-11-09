export const walletKeys = {
	all: ['wallets'] as const,
	list: () => [...walletKeys.all, 'list'] as const,
	detail: (id: string) => [...walletKeys.all, 'detail', id] as const,
}
