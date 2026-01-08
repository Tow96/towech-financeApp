import { createFileRoute } from '@tanstack/react-router'

import { WalletPage } from '@/ui/pages'

export const Route = createFileRoute('/_authed/wallets')({
	component: WalletPage,
})
