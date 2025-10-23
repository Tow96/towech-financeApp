import type { CategoryType } from '@/features/categories/domain.ts'

export const categoryKeys = {
	all: ['categories'] as const,
	lists: () => [...categoryKeys.all, 'list'] as const,
	list: (type: CategoryType) => [...categoryKeys.lists(), type] as const,
}
