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
import { cn, convertCentsToCurrencyString, formatNumberToLetterNotation } from '@/ui/utils'

interface BalanceTrendStatisticProps {
	className?: string
	period: { start: Date; end: Date }
}

export const BalanceTrendStatistic = ({ className, period }: BalanceTrendStatisticProps) => {
	const query = useBalanceStatistic(period.start, period.end)

	const cutoffDate = new Date(new Date().setHours(23, 59, 59, 999))
	let cutoffBalance = 0
	let previousPeriodComp: number | null = null

	// This assumes that the values are sorted by date already
	const dataWithCutoff = query.data?.items.map(x => {
		if (x.date <= cutoffDate) {
			const previousBalance = query.data.previousPeriodEnd.balance
			if (previousBalance !== 0)
				previousPeriodComp = ((x.balance - previousBalance) / previousBalance) * 100

			cutoffBalance = x.balance
			return { ...x, date: x.date.toLocaleDateString() }
		}
		return { ...x, balance: null, date: x.date.toLocaleDateString() }
	})

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
				<div className="-mt-3 mb-3">
					<div className="text-muted-foreground flex justify-between text-xs">
						<span>Balance at end</span>
						<span>vs previous period</span>
					</div>
					<div className="flex justify-between">
						<span>{convertCentsToCurrencyString(cutoffBalance)}</span>
						<span
							className={cn(
								previousPeriodComp === null || previousPeriodComp === 0 // eslint-disable-line
									? 'text-foreground'
									: previousPeriodComp > 0
										? 'text-constructive'
										: 'text-destructive',
							)}>
							{previousPeriodComp === null // eslint-disable-line
								? '- %'
								: `${Math.round(previousPeriodComp * 100) / 100} %`}
						</span>
					</div>
				</div>
				<ChartContainer config={chartConfig} className="h-[25vh] w-full">
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
