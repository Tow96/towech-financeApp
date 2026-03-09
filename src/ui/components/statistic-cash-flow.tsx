import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './base'

import type { ChartConfig } from './base'
import type { CashFlowTrendStatisticItemDto } from '@/core/dto'

import { convertCentsToCurrencyString, formatNumberToLetterNotation } from '@/ui/utils'

interface CashFlowStatisticProps {
	period: { start: Date; end: Date }
}

const data: Array<CashFlowTrendStatisticItemDto> = [
	{ date: new Date(2026, 1, 8), in: 5000, out: 8000, net: -3000 },
	{ date: new Date(2026, 1, 9), in: 2000, out: 3000, net: -1000 },
	{ date: new Date(2026, 1, 10), in: 9000, out: 2000, net: 7000 },
	{ date: new Date(2026, 1, 11), in: 10000, out: 0, net: 10000 },
	{ date: new Date(2026, 1, 12), in: 0, out: 0, net: 0 },
	{ date: new Date(2026, 1, 13), in: 0, out: 0, net: 0 },
	{ date: new Date(2026, 1, 14), in: 0, out: 3000, net: -3000 },
]

export const CashFlowTrendStatistic = ({ period }: CashFlowStatisticProps) => {
	const cutoffDate = new Date(new Date().setHours(23, 59, 59, 999))

	// This assumes that the values are sorted by date already
	const dataWithCutoff = data.map(x =>
		x.date <= cutoffDate
			? { ...x, out: -1 * x.out, date: x.date.toLocaleDateString() }
			: { ...x, net: null, in: null, out: null, date: x.date.toLocaleDateString() },
	)

	const domain = dataWithCutoff.reduce(
		(dom, curr) => [Math.min(dom[0], curr.out ?? dom[0]), Math.max(dom[1], curr.in ?? dom[1])],
		[0, 0],
	)
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

