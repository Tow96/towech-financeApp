import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button, Card, CardContent, CardHeader } from '@/ui/components'

import { PeriodSelector, PeriodSummary } from '@/features/movements/queries/list-movements/client'
import { WalletSelector } from '@/features/wallets/queries/list-wallets/client'
import { AddMovementDialog } from '@/features/movements/commands/add-movement/client'
import { PeriodMovementList } from '@/features/movements/queries/list-movements/client/movement-list'

export const DashboardPage = () => {
	const [openAdd, setOpenAdd] = useState<boolean>(false)
	const [selectedWalletId, setSelectedWalletId] = useState<string | undefined>('total')
	const [periodStart, setPeriodStart] = useState<Date>(new Date())

	return (
		<Card className="m-4">
			<CardHeader className="flex flex-col-reverse items-center justify-between gap-4 md:flex-row">
				<PeriodSelector start={periodStart} setStart={setPeriodStart} />
				<WalletSelector
					className="w-full md:w-1/2"
					value={selectedWalletId}
					onChange={setSelectedWalletId}
					showMoney
					showTotal
				/>
				<Button className="w-full md:w-auto" onClick={() => setOpenAdd(true)}>
					<Plus /> Add Movement
				</Button>
				<AddMovementDialog open={openAdd} setOpen={setOpenAdd} />
			</CardHeader>
			<CardContent className="max-h-[62vh] overflow-y-auto">
				<PeriodSummary selectedWalletId={selectedWalletId} periodStart={periodStart} />
				<PeriodMovementList selectedWalletId={selectedWalletId} periodStart={periodStart} />
			</CardContent>
		</Card>
	)
}
