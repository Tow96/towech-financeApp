import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from './base/chart'
import type { ChartConfig } from './base/chart'

import { useBalanceStatistic } from '@/ui/data-access'
import { convertCentsToCurrencyString } from '@/ui/utils'

const chartConfig = {
	balance: {
		label: 'Balance',
		color: '#2563eb',
	},
} satisfies ChartConfig

interface BalanceChartProps {
	className?: string
	period: {
		start: Date
		end: Date
	}
}

export function BalanceChart(props: BalanceChartProps) {
	const chart = useBalanceStatistic(props.period.start, props.period.end)

	const cutoffDate = new Date(new Date().setHours(23, 59, 59, 999))
	const chartWithoutFutureData = chart.data?.map(x =>
		x.date <= cutoffDate ? x : { date: x.date, balance: null },
	)

	const domain = chartWithoutFutureData?.reduce(
		(dom, curr) => [
			Math.min(dom[0], curr.balance ?? dom[0]),
			Math.max(dom[1], curr.balance ?? dom[1]),
		],
		[Infinity, 0],
	) ?? [0, 0]

	const domainDelta = domain[1] - domain[0]

	const domainWithMargins = [domain[0] - domainDelta * 0.1, domain[1] + domainDelta * 0.1]

	return (
		<ChartContainer config={chartConfig} className={props.className}>
			<AreaChart accessibilityLayer data={chartWithoutFutureData} margin={{ left: 12, right: 12 }}>
				<CartesianGrid vertical={false} stroke="#c4c4c4" />
				<YAxis
					tickLine={false}
					axisLine={false}
					domain={domainWithMargins}
					tickCount={10}
					tickFormatter={(v: number) => formatNumberToLetterNotation(v, domainDelta)}
				/>
				<XAxis
					dataKey="date"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					tickFormatter={(v: Date) => v.toLocaleDateString()}
				/>
				<Area
					dataKey="balance"
					type="linear"
					fill="var(--color-balance)"
					fillOpacity={0.3}
					stroke="var(--color-balance)"
				/>
				<ChartTooltip
					cursor={true}
					defaultIndex={1}
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
									<div className="text-foreground 5 ml-auto flex items-baseline gap-0 pl-1 font-mono font-medium tabular-nums">
										{convertCentsToCurrencyString(value as number)}
									</div>
								</div>
							)}
						/>
					}
				/>
			</AreaChart>
		</ChartContainer>
	)
}

/** Converts a given cent count to a string in "letter notation" with up to 2 decimal places
 *
 * Examples
 *
 * 1,000,000.43 => 1M
 *
 * 1,245,000.24 => 1.25M
 *
 *
 * 753,225.00 => 753K
 */
const formatNumberToLetterNotation = (cents: number, deltaCents: number) => {
	const money = Math.floor(cents / 100)
	const delta = deltaCents / 100

	if (money >= 1_000_000 && (delta > 10_000 || delta === 0)) {
		const millions = money / 1_000_000
		return millions > 100
			? `${millions.toFixed(0)}M`
			: `${Math.round((millions + Number.EPSILON) * 100) / 100}M` // its okay to use epsilon, we don't need exact values
	}

	if (money >= 1_000 && delta > 10) {
		const thousands = money / 1_000

		if (thousands < 1000) {
			// its okay to use epsilon, we don't need exact values
			return thousands > 100
				? `${Math.round(thousands).toLocaleString()}K`
				: `${(Math.round((thousands + Number.EPSILON) * 100) / 100).toLocaleString()}K`
		}
	}

	return money.toLocaleString()
}
