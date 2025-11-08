import { createFileRoute } from '@tanstack/react-router'

import { Card, CardContent, CardHeader } from '@/common/components/ui/card'
import { WalletList, WalletsTotal } from '@/features/wallets/queries/list-wallets/client'

export const Route = createFileRoute('/_authed/wallets')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Card className="m-4">
			<CardHeader className="flex items-center">
				<WalletsTotal />
			</CardHeader>
			<CardContent>
				<WalletList />
			</CardContent>
		</Card>
	)
}
