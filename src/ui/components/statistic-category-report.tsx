import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './base'
import { CategoryIcon } from './category-icon'
import { CategoryName } from './category-name'

import type { CategoryStatisticItemDto } from '@/core/dto'

import { useCategoryReportStatistic } from '@/ui/data-access'
import { cn, convertCentsToCurrencyString } from '@/ui/utils'

import { CategoryType } from '@/core/domain'

interface CategoryReportStatisticProps {
	period: { start: Date; end: Date }
}

export const CategoryReportStatistic = ({ period }: CategoryReportStatisticProps) => {
	const query = useCategoryReportStatistic(period.start, period.end)

	return (
		<div>
			{/* Income report */}
			<CategoryReportByType
				type={CategoryType.income}
				currentAmount={query.data?.income.currentAmount ?? 0}
				previousAmount={query.data?.income.previousAmount ?? 0}
				categories={query.data?.income.categories ?? []}
			/>

			{/* Expense report */}
			<CategoryReportByType
				negative
				type={CategoryType.expense}
				currentAmount={query.data?.expense.currentAmount ?? 0}
				previousAmount={query.data?.expense.previousAmount ?? 0}
				categories={query.data?.expense.categories ?? []}
			/>
		</div>
	)
}

interface CategoryReportByTypeProps {
	type: CategoryType
	previousAmount: number
	currentAmount: number
	categories: Array<CategoryStatisticItemDto>
	negative?: boolean
}
const CategoryReportByType = (props: CategoryReportByTypeProps) => {
	return (
		<Accordion type="multiple" className="pb-2 last:pb-0">
			<div className="border-b">
				<CategoryReportItem
					negative={props.negative}
					type={props.type}
					currentAmount={props.currentAmount}
					previousAmount={props.previousAmount}
				/>
			</div>

			{props.categories.map(x => (
				<AccordionItem value={x.id ?? ''}>
					<CategoryReportItem
						trigger={x.subCategories.length > 1 || x.subCategories[0].subId !== null}
						key={x.id}
						negative={props.negative}
						type={props.type}
						id={x.id}
						currentAmount={x.currentAmount}
						previousAmount={x.previousAmount}
					/>
					<AccordionContent>
						{(x.subCategories.length > 1 || x.subCategories[0].subId !== null) &&
							x.subCategories.map(y => (
								<CategoryReportItem
									key={x.id}
									negative={props.negative}
									type={props.type}
									id={x.id}
									subId={y.subId}
									currentAmount={y.currentAmount}
									previousAmount={y.previousAmount}
								/>
							))}
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	)
}

interface CategoryReportItemProps {
	type: CategoryType
	currentAmount: number
	previousAmount: number
	id?: string | null
	subId?: string | null
	negative?: boolean
	trigger?: boolean
}
const CategoryReportItem = (props: CategoryReportItemProps) => {
	const comparisson = getComparissonPercentage(props.currentAmount, props.previousAmount)

	const category = (
		<>
			<CategoryIcon
				className="h-6 w-6"
				category={{ type: props.type, id: props.id ?? null, subId: props.subId ?? null }}
			/>
			{props.id === undefined && props.subId === undefined && <span>{props.type}</span>}
			{props.id !== undefined && props.subId === null && <span className="italic">base</span>}
			{props.id !== undefined && props.subId !== null && (
				<CategoryName
					className="w-full"
					category={{ type: props.type, id: props.id ?? null, subId: props.subId ?? null }}
				/>
			)}
		</>
	)
	const categoryClass = cn(
		'flex w-1/2 gap-2 truncate py-1 align-middle',
		props.id !== undefined && 'pl-2',
		props.subId !== undefined && 'pl-4',
	)

	return (
		<div className="flex w-full justify-between">
			{/* Category */}
			{props.trigger ? (
				<AccordionTrigger className={categoryClass}>{category}</AccordionTrigger>
			) : (
				<div className={categoryClass}>{category}</div>
			)}
			{/* Amount */}
			<span className="flex-1 text-right">{convertCentsToCurrencyString(props.currentAmount)}</span>
			{/* Comparisson */}
			<span
				className={cn(
					'text-foreground w-1/5 text-right',
					comparisson !== null &&
						((!props.negative && comparisson < 0) || (props.negative && comparisson >= 0)) &&
						'text-destructive',
					comparisson !== null &&
						((props.negative && comparisson < 0) || (!props.negative && comparisson >= 0)) &&
						'text-constructive',
				)}>
				{comparisson ? `${Math.floor(comparisson)}%` : `---`}
			</span>
		</div>
	)
}

const getComparissonPercentage = (current: number, previous: number): number | null => {
	if (previous === 0) return null
	return ((current - previous) / previous) * 100
}
