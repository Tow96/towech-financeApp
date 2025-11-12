import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { Card, CardContent, CardHeader } from '@/common/components/ui/card'
import { PeriodSelector, PeriodSummary } from '@/features/movements/queries/list-movements/client'
import { PeriodMovementList } from '@/features/movements/queries/list-movements/client/movement-list.tsx'
import { WalletSelector } from '@/features/wallets/queries/list-wallets/client'

export const Route = createFileRoute('/_authed/dashboard')({
	component: RouteComponent,
})

function RouteComponent() {
	const [selectedWalletId, setSelectedWalletId] = useState<string | undefined>('total')
	const [periodStart, setPeriodStart] = useState<Date>(new Date())

	return (
		<Card className="m-4">
			<CardHeader className="flex items-center justify-between">
				<PeriodSelector start={periodStart} setStart={setPeriodStart} />
				<WalletSelector
					className="!h-16 w-1/2"
					selectedWalletId={selectedWalletId}
					setSelectedWalletId={setSelectedWalletId}
				/>
			</CardHeader>
			<CardContent>
				<PeriodSummary selectedWalletId={selectedWalletId} periodStart={periodStart} />
				<PeriodMovementList selectedWalletId={selectedWalletId} periodStart={periodStart} />
			</CardContent>
		</Card>
	)
}
