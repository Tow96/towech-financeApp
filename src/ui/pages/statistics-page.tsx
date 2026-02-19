import { PeriodSelector, Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/components'

export const StatisticsPage = () => {
	return (
		<Tabs defaultValue="balance" className="flex h-[90vh] flex-col px-4 py-6">
			<PeriodSelector />

			{/* Tab Selector */}
			<TabsList className="mt-4 w-full">
				<TabsTrigger value="balance">Balance</TabsTrigger>
				<TabsTrigger value="cash-flow">Cash flow</TabsTrigger>
				<TabsTrigger value="expenses">Expenses</TabsTrigger>
				<TabsTrigger value="reports">Reports</TabsTrigger>
			</TabsList>

			<div className="flex-1 overflow-auto">
				{/* Balance Tab */}
				<TabsContent value="balance">Balance charts here</TabsContent>

				{/* Cash-flow Tab */}
				<TabsContent value="cash-flow">Cash flow charts here</TabsContent>

				{/* Expenses tab */}
				<TabsContent value="expenses">Expenses charts here</TabsContent>

				{/* Reports tab */}
				<TabsContent value="reports">Reports here</TabsContent>
			</div>
		</Tabs>
	)
}

