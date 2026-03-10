import { CategoryStatisticItemDto } from '@/core/dto'
import { Accordion } from './base'
import { CategoryIcon } from './category-icon'
import { CategoryName } from './category-name'

import { CategoryType } from '@/core/domain'
import { useCategoryReportStatistic } from '@/ui/data-access'
import { cn, convertCentsToCurrencyString } from '@/ui/utils'

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
			{/* query.data?.map(x => (
			<div key={x.type}>
				<CategoryReportItem
					key={x.type}
					type={x.type}
					currentAmount={x.currentAmount}
					previousAmount={x.previousAmount}
				/>
				<div>
					{x.categories.length > 2 &&
						x.categories.map(y => (
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
		))) */}
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
		<>
			<CategoryReportItem
				negative={props.negative}
				type={props.type}
				currentAmount={props.currentAmount}
				previousAmount={props.previousAmount}
			/>
			{props.categories.map(x => (
				<>
					<CategoryReportItem
						key={x.id}
						negative={props.negative}
						type={props.type}
						id={x.id}
						currentAmount={x.currentAmount}
						previousAmount={x.previousAmount}
					/>
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
				</>
			))}
		</>
	)
}

interface CategoryReportItemProps {
	type: CategoryType
	currentAmount: number
	previousAmount: number
	id?: string | null
	subId?: string | null
	negative?: boolean
}
const CategoryReportItem = (props: CategoryReportItemProps) => {
	const comparisson = getComparissonPercentage(props.currentAmount, props.previousAmount)

	return (
		<div>
			<div className="flex justify-between">
				{/* Category */}
				<div
					className={cn(
						'flex w-1/2 gap-2 truncate py-1 align-middle',
						props.id !== undefined && 'pl-4',
						props.subId !== undefined && 'pl-8',
					)}>
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
				</div>
				{/* Amount */}
				<span className="flex-1 text-right">
					{convertCentsToCurrencyString(props.currentAmount)}
				</span>
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
		</div>
	)
}

const getComparissonPercentage = (current: number, previous: number): number | null => {
	if (previous === 0) return null
	return ((current - previous) / previous) * 100
}
