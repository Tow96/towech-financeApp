import { useQuery } from '@tanstack/react-query'

import { getWalletDetail } from './server'
import { walletKeys } from '@/features/wallets/store-keys'

export const useWalletDetail = (id: string) => {
	return useQuery({
		queryKey: walletKeys.detail(id),
		staleTime: 60000,
		queryFn: () => getWalletDetail({ data: { id } }),
	})
}
