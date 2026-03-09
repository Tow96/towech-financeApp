import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './base'

import type { ChartConfig } from './base'

import { useCashFlowTrendStatistic } from '@/ui/data-access'
import { convertCentsToCurrencyString, formatNumberToLetterNotation } from '@/ui/utils'

interface CashFlowStatisticProps {
	period: { start: Date; end: Date }
}

export const CashFlowTrendStatistic = ({ period }: CashFlowStatisticProps) => {
	const query = useCashFlowTrendStatistic(period.start, period.end)

	const cutoffDate = new Date(new Date().setHours(23, 59, 59, 999))

	// This assumes that the values are sorted by date already
	const dataWithCutoff = query.data?.map(x =>
		x.date <= cutoffDate
			? { ...x, out: -1 * x.out, date: x.date.toLocaleDateString() }
			: { ...x, net: null, in: null, out: null, date: x.date.toLocaleDateString() },
	)

	const domain = dataWithCutoff?.reduce(
		(dom, curr) => [Math.min(dom[0], curr.out ?? dom[0]), Math.max(dom[1], curr.in ?? dom[1])],
		[0, 0],
	) ?? [0, 0]
	const domainDelta = domain[1] - domain[0]

	return (
		<>
			<ChartContainer config={chartConfig} className="h-[25vh] w-full">
				<ComposedChart accessibilityLayer data={dataWithCutoff} stackOffset="sign">
					<CartesianGrid vertical={false} />
					<YAxis
						tickLine={false}
						tickFormatter={(v: number) => formatNumberToLetterNotation(v, domainDelta)}
					/>
					<XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
					<Bar stackId="a" dataKey="in" fill="var(--color-in)" radius={2} />
					<Bar stackId="a" dataKey="out" fill="var(--color-out)" radius={2} />
					<Line type="monotone" dataKey="net" stroke="var(--color-net)" strokeWidth="2" />
					<ChartTooltip
						cursor={true}
						content={a => (
							<ChartTooltipContent {...a} valueFormatter={v => convertCentsToCurrencyString(v)} />
						)}
					/>
				</ComposedChart>
			</ChartContainer>
		</>
	)
}

const chartConfig = {
	in: {
		label: 'In',
		color: 'var(--constructive)',
	},
	out: {
		label: 'Out',
		color: 'var(--destructive)',
	},
	net: {
		label: 'Net',
		color: 'var(--chart-6)',
	},
} satisfies ChartConfig
