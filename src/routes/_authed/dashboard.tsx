import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { Card, CardContent, CardHeader } from '@/common/components/ui/card'
import { PeriodSelector } from '@/features/movements/list-movements/period-selector'

export const Route = createFileRoute('/_authed/dashboard')({
	component: RouteComponent,
})

function RouteComponent() {
	const [periodStart, setPeriodStart] = useState<Date>(new Date())

	return (
		<Card className="m-4">
			<CardHeader className="flex items-center justify-between">
				<PeriodSelector start={periodStart} setStart={setPeriodStart} />
			</CardHeader>
			<CardContent>{periodStart.toISOString()}</CardContent>
		</Card>
	)
}
