import { useQuery } from '@tanstack/react-query'

import type { CategoryType } from '@/core/entities'
import { getCategoriesByType } from '@/core/functions'

import { categoryKeys } from '@/features/categories/store-keys'

export const useCategoryList = (type: CategoryType) => {
	return useQuery({
		queryKey: categoryKeys.list(type),
		staleTime: 60000,
		queryFn: () => getCategoriesByType({ data: { type } }),
	})
}
