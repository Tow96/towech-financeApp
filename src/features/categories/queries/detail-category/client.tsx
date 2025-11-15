import { useQuery } from '@tanstack/react-query'

import { getCategoryDetail } from './server'
import { CategoryType } from '@/features/categories/domain'

import { Icon } from '@/common/components/icon'
import { categoryKeys } from '@/features/categories/store-keys'
import { capitalizeFirst } from '@/common/lib/utils'

export const useCategoryDetail = (type: CategoryType, id: string, subId?: string) => {
	return useQuery({
		queryKey: categoryKeys.detail(type, id, subId ?? null),
		staleTime: 60000,
		queryFn: () => getCategoryDetail({ data: { id, subId } }),
	})
}

interface CategoryDetailProps {
	className?: string
	category: {
		type: CategoryType
		id: string | null
		subId: string | null
	}
}

export const CategoryIcon = ({ className, category }: CategoryDetailProps) => {
	if (!category.id) return <Icon className={className} id={0} name="Category" />

	const detail = useCategoryDetail(category.type, category.id, category.subId ?? undefined)
	return <Icon className={className} id={detail.data?.iconId ?? 0} name={detail.data?.name ?? ''} />
}

export const CategoryName = ({ className, category }: CategoryDetailProps) => {
	if (!category.id) return <span className={className}>{getUncategorizedName(category.type)}</span>

	const detail = useCategoryDetail(category.type, category.id, category.subId ?? undefined)
	return <span className={className}>{capitalizeFirst(detail.data?.name ?? '')}</span>
}

const getUncategorizedName = (type: CategoryType) => {
	if (type === CategoryType.expense) return 'Uncategorized expense'
	if (type === CategoryType.income) return 'Uncategorized income'
	return 'Uncategorized transfer'
}
