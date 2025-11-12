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
