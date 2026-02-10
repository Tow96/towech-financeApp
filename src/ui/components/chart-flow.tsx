import { Bar, BarChart, CartesianGrid, Line, XAxis, YAxis } from 'recharts'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from './base/chart'
import type { ChartConfig } from './base/chart'

import { useCashFlowStatistic } from '@/ui/data-access'
import { cn, convertCentsToCurrencyString, formatNumberToLetterNotation } from '@/ui/utils'

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
		color: 'var(--chart-3)',
	},
} satisfies ChartConfig

interface CashFlowChartProps {
	className?: string
	mode?: 'auto' | 'day' | 'month'
	period: {
		start: Date
		end: Date
	}
}

export const CashFlowChart = (props: CashFlowChartProps) => {
	const graphMode =
		props.mode && props.mode !== 'auto'
			? props.mode
			: Math.floor(
						(props.period.end.getTime() - props.period.start.getTime()) / (1000 * 60 * 60 * 24),
				  ) > 31
				? 'month'
				: 'day'

	const chart = useCashFlowStatistic(props.period.start, props.period.end, graphMode)

	const cutoffDate = new Date(new Date().setHours(23, 59, 59, 999))
	const chartWithoutFutureData = chart.data?.map(x =>
		x.date <= cutoffDate ? x : { date: x.date, in: null, out: null, net: null },
	)

	const domain = chartWithoutFutureData?.reduce(
		(dom, curr) => [Math.min(dom[0], curr.out ?? dom[0]), Math.max(dom[1], curr.in ?? dom[1])],
		[0, 0],
	) ?? [0, 0]

	const domainDelta = domain[1] - domain[0]

	// TODO: Proper chart skeleton
	return chart.isPending ? (
		<div className={cn('flex items-center justify-center', props.className)}>Loading...</div>
	) : (
		<ChartContainer config={chartConfig} className={props.className}>
			<BarChart accessibilityLayer data={chartWithoutFutureData} stackOffset="sign">
				<CartesianGrid vertical={false} />
				<YAxis
					tickLine={false}
					axisLine={false}
					domain={domain}
					width={50}
					tickCount={10}
					tickFormatter={(v: number) => formatNumberToLetterNotation(v, domainDelta)}
				/>
				<XAxis
					dataKey="date"
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(v: Date) => v.toLocaleDateString()}
				/>
				<ChartTooltip
					cursor={true}
					content={
						<ChartTooltipContent
							hideLabel
							formatter={(value, name) => (
								<div className="text-muted-foreground flex min-w-32 items-center text-xs">
									<div
										className="mr-1 h-2.5 w-1.5 shrink-0 rounded-[2px] bg-(--color-bg)"
										style={
											{
												'--color-bg': `var(--color-${name})`,
											} as React.CSSProperties
										}
									/>
									{chartConfig[name as keyof typeof chartConfig].label || name}
									<div className="text-foreground ml-auto flex items-baseline gap-0 pl-1 font-mono font-medium tabular-nums">
										{convertCentsToCurrencyString(value as number)}
									</div>
								</div>
							)}
						/>
					}
				/>
				<Bar stackId="a" dataKey="in" fill="var(--color-in)" radius={2} />
				<Bar stackId="a" dataKey="out" fill="var(--color-out)" radius={2} />
			</BarChart>
		</ChartContainer>
	)
}
