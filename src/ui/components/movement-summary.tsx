import { useMovements } from '@/ui/data-access'
import { convertCentsToCurrencyString } from '@/ui/utils'

import { CategoryType } from '@/core/domain'

interface MovementSummaryProps {
	selectedWalletId: string | undefined
	periodStart: Date
}

export const MovementSummary = (props: MovementSummaryProps) => {
	const movements = useMovements(props.selectedWalletId, props.periodStart)

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
