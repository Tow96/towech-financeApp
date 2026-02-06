import { useState } from 'react'

import type { PeriodSelectorValue } from '@/ui/components'

import { BalanceChart, PeriodSelector } from '@/ui/components'

export const DashboardPage = () => {
	const [selectedPeriod, setSelectedPeriod] = useState<PeriodSelectorValue>({
		start: new Date(),
		end: new Date(),
	})

	return (
		<>
			<PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
			<BalanceChart period={selectedPeriod} />
		</>
	)
}
