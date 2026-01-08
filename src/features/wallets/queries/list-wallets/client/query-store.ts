import { useQuery } from '@tanstack/react-query'

import { getWalletTotals } from '@/core/functions'

import { walletKeys } from '@/features/wallets/store-keys'

export const useWalletsTotal = () => {
	return useQuery({
		queryKey: walletKeys.list(),
		staleTime: 60000,
		queryFn: () => getWalletTotals({ data: {} }),
	})
}
