import { useQuery } from '@tanstack/react-query'

import type { CategoryType } from '@/features/categories/domain'
import { categoryKeys } from '@/features/categories/store-keys'
import { getCategoriesByType } from '@/features/categories/queries/list-categories/server'

export const useCategoryList = (type: CategoryType) => {
	return useQuery({
		queryKey: categoryKeys.list(type),
		staleTime: 60000,
		queryFn: () => getCategoriesByType({ data: { type } }),
	})
}
