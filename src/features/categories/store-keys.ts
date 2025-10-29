import type { CategoryType } from '@/features/categories/domain'

export const categoryKeys = {
	all: ['categories'] as const,
	lists: () => [...categoryKeys.all, 'list'] as const,
	list: (type: CategoryType) => [...categoryKeys.lists(), type] as const,
	detail: (type: CategoryType, id: string, subId: string | null) =>
		[...categoryKeys.all, 'detail', type, id, subId] as const,
}
