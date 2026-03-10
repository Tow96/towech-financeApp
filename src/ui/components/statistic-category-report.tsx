import { CategoryType } from '@/core/domain'
import { CategoryIcon } from './category-icon'
import { CategoryName } from './category-name'

import { useCategoryReportStatistic } from '@/ui/data-access'
import { cn, convertCentsToCurrencyString } from '@/ui/utils'

interface CategoryReportStatisticProps {
	period: { start: Date; end: Date }
}

export const CategoryReportStatistic = ({ period }: CategoryReportStatisticProps) => {
	const query = useCategoryReportStatistic(period.start, period.end)
	// const sum = query.data?.reduce(
	// 	(acc, x) => {
	// 		const dir = x.type === CategoryType.income ? 1 : -1
	// 		return [acc[0] + dir * x.previousAmount, acc[1] + dir * x.currentAmount]
	// 	},
	// 	[0, 0],
	// ) ?? [0, 0]

	return (
		<div>
			{query.data?.map(x => (
				<div key={x.type}>
					<div className="flex justify-between">
						<CategoryIcon category={{ type: x.type, id: null, subId: null }} />
						<CategoryName category={{ type: x.type, id: null, subId: null }} />
						{/* <span>{convertCentsToCurrencyString(x.previousAmount)}</span> */}
						<span>{convertCentsToCurrencyString(x.currentAmount)}</span>
					</div>
					<div>
						{x.categories.map(y => (
							<div>
								<CategoryReportItem
									key={y.id}
									type={x.type}
									id={y.id}
									currentAmount={y.currentAmount}
									previousAmount={y.previousAmount}
								/>
								<div>
									{y.subCategories.length > 2 &&
										y.subCategories.map(z => (
											<CategoryReportItem
												key={z.subId}
												type={x.type}
												id={y.id}
												subId={z.subId}
												currentAmount={z.currentAmount}
												previousAmount={z.previousAmount}
											/>
										))}
								</div>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	)
}

interface CategoryReportItemProps {
	type: CategoryType
	currentAmount: number
	previousAmount: number
	id: string | null
	subId?: string | null
}
const CategoryReportItem = (props: CategoryReportItemProps) => {
	const comparisson = getComparissonPercentage(props.currentAmount, props.previousAmount)

	return (
		<div>
			<div className="flex justify-between pl-8">
				<div className={cn('flex gap-2 pl-4', props.subId !== undefined && 'pl-8')}>
					<CategoryIcon category={{ type: props.type, id: props.id, subId: props.subId ?? null }} />
					{props.subId !== undefined && props.subId === null ? (
						<span className="italic">base</span>
					) : (
						<CategoryName
							category={{ type: props.type, id: props.id, subId: props.subId ?? null }}
						/>
					)}
				</div>
				<span>{convertCentsToCurrencyString(props.currentAmount)}</span>
				<span
					className={cn(
						'text-foreground',
						comparisson !== null && comparisson < 0 && 'text-destructive',
						comparisson !== null && comparisson >= 0 && 'text-constructive',
					)}>
					{comparisson ? `${Math.floor(comparisson)}%` : `-%`}
				</span>
			</div>
		</div>
	)
}

const getComparissonPercentage = (current: number, previous: number): number | null => {
	if (previous === 0) return null
	return ((current - previous) / previous) * 100
}

