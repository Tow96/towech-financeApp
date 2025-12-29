import { createFileRoute } from '@tanstack/react-router'

import { WalletPage } from '@/pages/wallet-page'

export const Route = createFileRoute('/_authed/wallets')({
	component: WalletPage,
})
