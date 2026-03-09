import { useState } from 'react'

import type { PeriodSelectorValue } from '@/ui/components'

import {
	BalancePerWalletStatistic,
	BalanceTrendStatistic,
	CashFlowTrendStatistic,
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
				<TabsTrigger value="expenses">Expenses</TabsTrigger>
				<TabsTrigger value="reports">Reports</TabsTrigger>
			</TabsList>

			<div className="flex-1 overflow-auto">
				{/* Balance Tab */}
				<TabsContent value="balance">
					<BalanceTrendStatistic period={selectedPeriod} />
					<BalancePerWalletStatistic className="mt-4" period={selectedPeriod} />
				</TabsContent>

				{/* Cash-flow Tab */}
				<TabsContent value="cash-flow">
					<CashFlowTrendStatistic period={selectedPeriod} />
				</TabsContent>

				{/* Expenses tab */}
				<TabsContent value="expenses">Expenses charts here</TabsContent>

				{/* Reports tab */}
				<TabsContent value="reports">Reports here</TabsContent>
			</div>
		</Tabs>
	)
}

