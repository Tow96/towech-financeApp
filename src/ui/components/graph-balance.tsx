import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from './base/chart'

import type { ChartConfig } from './base/chart'

const chartData = [
	{ date: new Date('2026-01-18'), balance: 186 },
	{ date: new Date('2026-01-19'), balance: 305 },
	{ date: new Date('2026-01-20'), balance: 237 },
	{ date: new Date('2026-01-21'), balance: 73 },
	{ date: new Date('2026-01-22'), balance: 209 },
	{ date: new Date('2026-01-23'), balance: 214 },
	{ date: new Date('2026-01-24'), balance: 214 },
]

const chartConfig = {
	balance: {
		label: 'Balance',
		color: '#2563eb',
	},
} satisfies ChartConfig

export function BalanceGraph() {
	return (
		<ChartContainer config={chartConfig} className="max-h-60 w-full">
			<AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
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

