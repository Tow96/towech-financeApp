import { convertCentsToCurrencyString } from '@/common/lib/utils'

import { CategoryType } from '@/features/categories/domain'
import { usePeriodMovements } from '@/features/movements/queries/list-movements/client/query-store'

interface PeriodSummaryProps {
	selectedWalletId: string | undefined
	periodStart: Date
}

export const PeriodSummary = (props: PeriodSummaryProps) => {
	const movements = usePeriodMovements(props.selectedWalletId, props.periodStart)

	// This should be converted to a tanStack selector instead
	const inMoney = (movements.data ?? [])
		.filter(m => m.category.type === CategoryType.income)
		.map(m => m.amount)
		.reduce((acc, cur) => acc + cur, 0)
	const outMoney = (movements.data ?? [])
		.filter(m => m.category.type === CategoryType.expense)
		.map(m => m.amount)
		.reduce((acc, cur) => acc + cur, 0)

	return (
		<div className="text-2xl md:text-3xl">
			<div className="flex justify-between">
				<span>In:</span>
				<span className="text-constructive">{convertCentsToCurrencyString(inMoney)}</span>
			</div>
			<div className="flex justify-between">
				<span>Out:</span>
				<span className="text-destructive border-primary border-b-2">
					{convertCentsToCurrencyString(outMoney)}
				</span>
			</div>
			<div className="flex justify-between">
				<span>Total:</span>
				<span>{convertCentsToCurrencyString(inMoney - outMoney)}</span>
			</div>
		</div>
	)
}
