import { useState } from 'react'

import type { PeriodSelectorValue } from '@/ui/components'

import {
	BalancePerWalletStatistic,
	BalanceTrendStatistic,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CashFlowStatistic,
	CashFlowTrendStatistic,
	CategoryReportStatistic,
	PeriodSelector,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/ui/components'

export const StatisticsPage = () => {
	const [selectedPeriod, setSelectedPeriod] = useState<PeriodSelectorValue>({
		start: new Date(),
		end: new Date(),
	})

	return (
		<Tabs defaultValue="balance" className="flex h-[90vh] flex-col px-4 py-6">
			<PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />

			{/* Tab Selector */}
			<TabsList className="mt-4 w-full">
				<TabsTrigger value="balance">Balance</TabsTrigger>
				<TabsTrigger value="cash-flow">Cash flow</TabsTrigger>
				{/* <TabsTrigger value="expenses">Expenses</TabsTrigger> */}
				<TabsTrigger value="reports">Reports</TabsTrigger>
			</TabsList>

			<div className="flex-1 overflow-auto">
				{/* Balance Tab */}
				<TabsContent value="balance">
					{/* Balance Trend */}
					<Card>
						<CardHeader>
							<CardTitle>Balance trend</CardTitle>
							<CardDescription>Do I have more money than before?</CardDescription>
						</CardHeader>
						<CardContent>
							<BalanceTrendStatistic period={selectedPeriod} />
						</CardContent>
					</Card>
					{/* Balance per wallet */}
					<Card className="mt-4">
						<CardHeader>
							<CardTitle>Balance per wallet</CardTitle>
							<CardDescription>Where is most of my money located?</CardDescription>
						</CardHeader>
						<CardContent>
							<BalancePerWalletStatistic period={selectedPeriod} />
						</CardContent>
					</Card>
				</TabsContent>

				{/* Cash-flow Tab */}
				<TabsContent value="cash-flow">
					{/* Cash-flow */}
					<Card>
						<CardHeader>
							<CardTitle>Cash Flow</CardTitle>
							<CardDescription>Am I spending less than I make?</CardDescription>
						</CardHeader>
						<CardContent>
							<CashFlowStatistic period={selectedPeriod} />
						</CardContent>
					</Card>
					{/* Cash-flow trend */}
					<Card className="mt-4">
						<CardHeader>
							<CardTitle>Cash Flow Trend</CardTitle>
							<CardDescription>In which periods was I saving more or less money?</CardDescription>
						</CardHeader>
						<CardContent>
							<CashFlowTrendStatistic period={selectedPeriod} />
						</CardContent>
					</Card>
				</TabsContent>

				{/* Expenses tab */}
				<TabsContent value="expenses">Expenses charts here</TabsContent>

				{/* Reports tab */}
				<TabsContent value="reports">
					{/* Category report */}
					<Card>
						<CardHeader>
							<CardTitle>Category report</CardTitle>
							<CardDescription>Where does my money go?</CardDescription>
						</CardHeader>
						<CardContent>
							<CategoryReportStatistic period={selectedPeriod} />
						</CardContent>
					</Card>
				</TabsContent>
			</div>
		</Tabs>
	)
}
