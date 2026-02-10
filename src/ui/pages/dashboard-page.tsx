import { useState } from 'react'

import type { PeriodSelectorValue } from '@/ui/components'

import {
	BalanceChart,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CashFlowChart,
	PeriodSelector,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/ui/components'

export const DashboardPage = () => {
	const [selectedPeriod, setSelectedPeriod] = useState<PeriodSelectorValue>({
		start: new Date(),
		end: new Date(),
	})

	return (
		<Tabs defaultValue="cash-flow">
			<Card className="m-4">
				<CardHeader>
					<TabsList className="w-full">
						<TabsTrigger value="balance">Balance</TabsTrigger>
						<TabsTrigger value="cash-flow">Cash flow</TabsTrigger>
					</TabsList>
				</CardHeader>
				<CardContent className="flex-1">
					<TabsContent value="balance">
						<BalanceChart className="h-[20vh] w-full md:h-[30vh]" period={selectedPeriod} />
					</TabsContent>
					<TabsContent value="cash-flow">
						<CashFlowChart className="h-[20vh] w-full md:h-[30vh]" period={selectedPeriod} />
					</TabsContent>
				</CardContent>
				<CardFooter>
					<PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
				</CardFooter>
			</Card>
		</Tabs>
	)
}
