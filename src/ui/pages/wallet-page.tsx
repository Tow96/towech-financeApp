import { Plus } from 'lucide-react'
import { useState } from 'react'

import {
	AddWalletDialog,
	Button,
	Card,
	CardContent,
	CardHeader,
	WalletList,
	WalletsTotal,
} from '@/ui/components'

export const WalletPage = () => {
	const [openAdd, setOpenAdd] = useState(false)

	return (
		<>
			<AddWalletDialog open={openAdd} setOpen={setOpenAdd} />
			<Card className="m-4">
				<CardHeader className="flex flex-col-reverse items-center gap-4 md:flex-row">
					<WalletsTotal />
					<Button className="w-full md:w-auto" onClick={() => setOpenAdd(true)}>
						<Plus />
						Add Wallet
					</Button>
				</CardHeader>
				<CardContent>
					<WalletList />
				</CardContent>
			</Card>
		</>
	)
}
