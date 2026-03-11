import { useCashFlowStatistic } from '@/ui/data-access'

import { cn, convertCentsToCurrencyString } from '@/ui/utils'

interface CashFlowStatisticProps {
	period: { start: Date; end: Date }
}

export const CashFlowStatistic = ({ period }: CashFlowStatisticProps) => {
	const query = useCashFlowStatistic(period.start, period.end)

	const previousPeriodComp =
		!query.data || query.data.previousPeriodEnd === 0
			? null
			: ((query.data.net - query.data.previousPeriodEnd) / query.data.previousPeriodEnd) * 100

	const highestValue = Math.max(query.data?.in ?? 0, query.data?.out ?? 0)

	return (
		<div>
			{/* Header */}
			<div>
				<div className="text-muted-foreground flex justify-between text-xs">
					<span>This period</span>
					<span>vs previous period</span>
				</div>
				<div className="flex justify-between">
					<span>{convertCentsToCurrencyString(query.data?.net ?? 0)}</span>
					<span
						className={cn(
							'text-foreground',
							previousPeriodComp !== null && previousPeriodComp < 0 && 'text-destructive',
							previousPeriodComp !== null && previousPeriodComp >= 0 && 'text-constructive',
						)}>
						{previousPeriodComp === null ? '- %' : `${Math.floor(previousPeriodComp)}%`}
					</span>
				</div>
			</div>
			<CashFlowBar name="Income" highest={highestValue} value={query.data?.in ?? 0} />
			<CashFlowBar name="Expense" highest={highestValue} value={query.data?.out ?? 0} negative />
		</div>
	)
}

interface CashFlowBarProps {
	name: string
	value: number
	highest: number
	negative?: boolean
}
const CashFlowBar = ({ name, value, highest, negative }: CashFlowBarProps) => {
	const barWidth = Math.max((Math.abs(value) / highest) * 100, 1)

	return (
		<div>
			<div className="flex justify-between pt-3">
				<div className="flex pb-1 align-middle">{name}</div>
				<span>{convertCentsToCurrencyString(value)}</span>
			</div>
			<div className="bg-muted flex rounded-sm">
				<div
					className={cn('h-6 rounded-sm', negative ? 'bg-destructive' : 'bg-constructive')}
					style={{ width: `${barWidth}%` }}
				/>
			</div>
		</div>
	)
}
