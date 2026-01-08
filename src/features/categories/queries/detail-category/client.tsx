import { useCategoryDetail } from '@/ui/data-access'
import { CategoryType } from '@/core/entities'

import { Icon } from '@/ui/components'
import { capitalizeFirst } from '@/ui/utils'

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
