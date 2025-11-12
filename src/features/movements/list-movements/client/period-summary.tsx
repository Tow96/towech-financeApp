import { usePeriodMovements } from '@/features/movements/list-movements/client/query-store.ts'

interface PeriodSummaryProps {
	periodStart: Date
}

export const PeriodSummary = (props: PeriodSummaryProps) => {
	const movements = usePeriodMovements(props.periodStart)

	return <div>{JSON.stringify(movements.data ?? {})}</div>
}
