export const movementKeys = {
	all: ['movements'] as const,
	list: (walletId: string | undefined, start: Date) =>
		[...movementKeys.all, 'list', walletId ?? 'total', `${start.getFullYear()}-${start.getMonth() + 1}`] as const,
	detail: (id: string) => [...movementKeys.all, 'detail', id] as const,
}
