import { useState } from 'react'

import type { PeriodSelectorValue } from '@/ui/components'

import { BalanceChart, Card, CardContent, CardFooter, PeriodSelector } from '@/ui/components'

export const DashboardPage = () => {
	const [selectedPeriod, setSelectedPeriod] = useState<PeriodSelectorValue>({
		start: new Date(),
		end: new Date(),
	})

	return (
		<>
			<Card className="m-4">
				<CardContent className="flex-1">
					<BalanceChart className="h-[20vh] w-full md:h-[30vh]" period={selectedPeriod} />
				</CardContent>
				<CardFooter>
					<PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
				</CardFooter>
			</Card>
		</>
	)
}
