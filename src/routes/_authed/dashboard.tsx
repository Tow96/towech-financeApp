import { Plus } from 'lucide-react'
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { Button } from '@/common/components/ui/button'
import { Card, CardContent, CardHeader } from '@/common/components/ui/card'

import { AddMovementDialog } from '@/features/movements/commands/add-movement/client'
import { PeriodSelector, PeriodSummary } from '@/features/movements/queries/list-movements/client'
import { PeriodMovementList } from '@/features/movements/queries/list-movements/client/movement-list'
import { WalletSelector } from '@/features/wallets/queries/list-wallets/client'

export const Route = createFileRoute('/_authed/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
	const [openAdd, setOpenAdd] = useState<boolean>(false)
	const [selectedWalletId, setSelectedWalletId] = useState<string | undefined>('total')
	const [periodStart, setPeriodStart] = useState<Date>(new Date())

	return (
		<Card className="m-4">
			<CardHeader className="flex items-center justify-between">
				<PeriodSelector start={periodStart} setStart={setPeriodStart} />
				<WalletSelector
					className="w-1/2"
					value={selectedWalletId}
					onChange={setSelectedWalletId}
					showMoney
					showTotal
				/>
				<Button onClick={() => setOpenAdd(true)}>
					<Plus /> Add Movement
				</Button>
				<AddMovementDialog open={openAdd} setOpen={setOpenAdd} />
			</CardHeader>
			<CardContent>
				<PeriodSummary selectedWalletId={selectedWalletId} periodStart={periodStart} />
				<PeriodMovementList selectedWalletId={selectedWalletId} periodStart={periodStart} />
			</CardContent>
		</Card>
	)
}
