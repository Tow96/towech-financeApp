import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { useBalanceAnalysis } from '../data-access'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from './base/chart'

import type { ChartConfig } from './base/chart'

const chartConfig = {
	balance: {
		label: 'Balance',
		color: '#2563eb',
	},
} satisfies ChartConfig

export function BalanceChart() {
	const chart = useBalanceAnalysis()

	return (
		<ChartContainer config={chartConfig} className="max-h-60 w-full">
			<AreaChart accessibilityLayer data={chart.data} margin={{ left: 12, right: 12 }}>
				<CartesianGrid vertical={false} stroke="#c4c4c4" />
				<YAxis tickLine={false} axisLine={false} />
				<XAxis
					dataKey="date"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					tickFormatter={(v: Date) => v.toLocaleDateString()}
				/>
				<ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
				<Area
					dataKey="balance"
					type="linear"
					fill="var(--color-balance)"
					fillOpacity={0.4}
					stroke="var(--color-balance)"
				/>
			</AreaChart>
		</ChartContainer>
	)
}

