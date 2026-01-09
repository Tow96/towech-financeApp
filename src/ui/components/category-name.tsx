import { useCategoryDetail } from '@/ui/data-access'
import { CategoryType } from '@/core/entities'

import { capitalizeFirst } from '@/ui/utils'

interface CategoryNameProps {
	className?: string
	category: {
		type: CategoryType
		id: string | null
		subId: string | null
	}
}

export const CategoryName = ({ className, category }: CategoryNameProps) => {
	if (!category.id) return <span className={className}>{getUncategorizedName(category.type)}</span>

	const detail = useCategoryDetail(category.type, category.id, category.subId ?? undefined)
	return <span className={className}>{capitalizeFirst(detail.data?.name ?? '')}</span>
}

const getUncategorizedName = (type: CategoryType) => {
	if (type === CategoryType.expense) return 'Uncategorized expense'
	if (type === CategoryType.income) return 'Uncategorized income'
	return 'Uncategorized transfer'
}
