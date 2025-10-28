import { useQuery } from '@tanstack/react-query'
import type { CategoryType } from '@/features/categories/domain'

import { categoryKeys } from '@/features/categories/store-keys'
import { getCategoryDetail } from '@/features/categories/queries/detail-category/server.ts'

export const useCategoryDetail = (type: CategoryType, id: string) => {
	return useQuery({
		queryKey: categoryKeys.detail(type, id, null),
		staleTime: 60000,
		queryFn: () => getCategoryDetail({ data: { id } }),
	})
}
