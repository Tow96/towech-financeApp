import { Icon, Skeleton } from './base'

import { CategoryType } from '@/core/domain'

import { useCategoryDetail } from '@/ui/data-access'
import { cn } from '@/ui/utils'

interface CategoryIconProps {
	className?: string
	category: {
		type: CategoryType
		id: string | null
		subId: string | null
	}
}

export const CategoryIcon = ({ className, category }: CategoryIconProps) => {
	if (!category.id)
		return <Icon className={className} id={UncategorizedIcon(category.type)} name="Category" />

	const detail = useCategoryDetail(category.type, category.id, category.subId ?? undefined)
	return detail.isPending ? (
		<Skeleton className={cn('rounded-full', className)} />
	) : (
		<Icon className={className} id={detail.data?.iconId ?? 0} name={detail.data?.name ?? ''} />
	)
}

const UncategorizedIcon = (type: CategoryType) => {
	if (type === CategoryType.expense) return 4
	if (type === CategoryType.income) return 3
	return 36
}
