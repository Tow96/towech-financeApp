import { useQuery } from '@tanstack/react-query'
import { walletKeys } from '@/features/wallets/store-keys.ts'
import { getWalletTotals } from '@/features/wallets/queries/list-wallets/server.ts'

export const useWalletsTotal = () => {
	return useQuery({
		queryKey: walletKeys.list(),
		staleTime: 60000,
		queryFn: () => getWalletTotals({ data: {} }),
	})
}
