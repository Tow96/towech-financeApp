import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from './base'
import type { ChartConfig } from './base'

import { useBalanceStatistic } from '@/ui/data-access'
import { convertCentsToCurrencyString, formatNumberToLetterNotation } from '@/ui/utils'
// import { ChartTooltipContent } from './base/chart-legacy'

interface BalanceTrendStatisticProps {
	className?: string
	period: { start: Date; end: Date }
}

export const BalanceTrendStatistic = ({ className, period }: BalanceTrendStatisticProps) => {
	const query = useBalanceStatistic(period.start, period.end)

	const cutoffDate = new Date(new Date().setHours(23, 59, 59, 999))

	const dataWithCutoff = query.data?.map(x =>
		x.date <= cutoffDate
			? { ...x, date: x.date.toLocaleDateString() }
			: { ...x, balance: null, date: x.date.toLocaleDateString() },
	)

	const domain = dataWithCutoff?.reduce(
		(dom, curr) => [
			Math.min(dom[0], curr.balance ?? dom[0]),
			Math.max(dom[1], curr.balance ?? dom[1]),
		],
		[Infinity, 0],
	) ?? [0, 0]
	const domainDelta = domain[1] - domain[0]
	const domainWithMargins = [domain[0] - domainDelta * 0.1, domain[1] + domainDelta * 0.1]

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Balance trend</CardTitle>
				<CardDescription>Do I have more money than before?</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[20vh] w-full">
					<AreaChart accessibilityLayer data={dataWithCutoff} margin={{ left: -10, right: 12 }}>
						<CartesianGrid vertical={false} stroke="#c4c4c4" />
						<YAxis
							tickLine={false}
							axisLine={false}
							domain={domainWithMargins}
							width={50}
							tickCount={10}
							tickFormatter={(v: number) => formatNumberToLetterNotation(v, domainDelta)}
						/>
						<XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
						<Area
							dataKey="balance"
							type="linear"
							fill="var(--color-balance)"
							fillOpacity={0.3}
							stroke="var(--color-balance)"
						/>
						<ChartTooltip
							cursor={true}
							content={a => (
								<ChartTooltipContent
									{...a}
									valueFormatter={value => convertCentsToCurrencyString(value)}
								/>
							)}
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

const chartConfig = {
	balance: {
		label: 'Balance',
		color: 'var(--chart-6)',
	},
} satisfies ChartConfig
