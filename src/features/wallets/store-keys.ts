export const walletKeys = {
	all: ['wallets'] as const,
	list: () => [...walletKeys.all, 'list'] as const,
}
