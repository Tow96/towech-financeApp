import { useCategoryReportStatistic } from '../data-access'

interface CategoryReportStatisticProps {
	period: { start: Date; end: Date }
}

export const CategoryReportStatistic = ({ period }: CategoryReportStatisticProps) => {
	const query = useCategoryReportStatistic(period.start, period.end)

	return <div>{JSON.stringify(query.data)}</div>
}

