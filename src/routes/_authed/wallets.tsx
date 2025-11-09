import { useState } from 'react'
import { Plus } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'

import { Card, CardContent, CardHeader } from '@/common/components/ui/card'
import { Button } from '@/common/components/ui/button'

import { AddWalletDialog } from '@/features/wallets/commands/add-wallet/client'
import { WalletList, WalletsTotal } from '@/features/wallets/queries/list-wallets/client'

export const Route = createFileRoute('/_authed/wallets')({
	component: RouteComponent,
})

function RouteComponent() {
	const [openAdd, setOpenAdd] = useState(false)

	return (
		<>
			<AddWalletDialog open={openAdd} setOpen={setOpenAdd} />
			<Card className="m-4">
				<CardHeader className="flex items-center">
					<WalletsTotal />
					<Button onClick={() => setOpenAdd(true)}>
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
