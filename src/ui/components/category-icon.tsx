import type { CategoryType } from '@/core/entities'

import { useCategoryDetail } from '@/ui/data-access'
import { Icon } from '@/ui/components'

interface CategoryIconProps {
	className?: string
	category: {
		type: CategoryType
		id: string | null
		subId: string | null
	}
}

export const CategoryIcon = ({ className, category }: CategoryIconProps) => {
	if (!category.id) return <Icon className={className} id={0} name="Category" />

	const detail = useCategoryDetail(category.type, category.id, category.subId ?? undefined)
	return <Icon className={className} id={detail.data?.iconId ?? 0} name={detail.data?.name ?? ''} />
}

