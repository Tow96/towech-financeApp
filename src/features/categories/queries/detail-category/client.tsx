import { useQuery } from '@tanstack/react-query'
import type { CategoryType } from '@/features/categories/domain'

import { categoryKeys } from '@/features/categories/store-keys'
import { getCategoryDetail } from '@/features/categories/queries/detail-category/server'

export const useCategoryDetail = (type: CategoryType, id: string, subId?: string) => {
	return useQuery({
		queryKey: categoryKeys.detail(type, id, subId ?? null),
		staleTime: 60000,
		queryFn: () => getCategoryDetail({ data: { id, subId } }),
	})
}
