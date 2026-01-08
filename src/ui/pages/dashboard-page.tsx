import { Plus } from 'lucide-react'
import { useState } from 'react'

import {
	AddMovementDialog,
	Button,
	Card,
	CardContent,
	CardHeader,
	MovementList,
	MovementSummary,
	PeriodSelector,
	WalletSelector,
} from '@/ui/components'

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
				<MovementSummary selectedWalletId={selectedWalletId} periodStart={periodStart} />
				<MovementList selectedWalletId={selectedWalletId} periodStart={periodStart} />
			</CardContent>
		</Card>
	)
}
