import { useState } from 'react'
import { Plus } from 'lucide-react'

import {
	AddMovementDialog,
	Button,
	Card,
	CardContent,
	CardHeader,
	MonthSelector,
	MovementList,
	WalletSelector,
} from '@/ui/components'

export const MovementPage = () => {
	const [openAdd, setOpenAdd] = useState<boolean>(false)
	const [selectedWalletId, setSelectedWalletId] = useState<string | undefined>('total')
	const [periodStart, setPeriodStart] = useState<Date>(new Date())

	return (
		<Card className="m-4 max-h-[80vh] md:max-h-[85vh]">
			<CardHeader className="flex flex-col items-center justify-between gap-4 md:flex-row">
				<WalletSelector
					value={selectedWalletId}
					onChange={setSelectedWalletId}
					showMoney
					showTotal
				/>
				<div className="flex w-full flex-col-reverse gap-4 md:w-auto md:flex-col md:gap-2">
					<Button className="w-full" onClick={() => setOpenAdd(true)}>
						<Plus /> Add Movement
					</Button>
					<MonthSelector value={periodStart} onChange={setPeriodStart} />
				</div>
			</CardHeader>
			<CardContent className="overflow-auto">
				<AddMovementDialog open={openAdd} setOpen={setOpenAdd} />
				<MovementList selectedWalletId={selectedWalletId} periodStart={periodStart} />
			</CardContent>
		</Card>
	)
}
