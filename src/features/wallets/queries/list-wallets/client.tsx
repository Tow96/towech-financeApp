import { useQuery } from '@tanstack/react-query'

import { Skeleton } from '@/common/components/ui/skeleton'
import { walletKeys } from '@/features/wallets/store-keys'
import { getWalletTotals } from '@/features/wallets/queries/list-wallets/server'
import { convertCentsToCurrencyString } from '@/common/lib/utils.ts'

const useWalletsTotal = () => {
	return useQuery({
		queryKey: walletKeys.list(),
		staleTime: 60000,
		queryFn: () => getWalletTotals({ data: {} }),
	})
}

export const WalletsTotal = () => {
	const { data, isPending } = useWalletsTotal()
	return (
		<span className="flex flex-1 items-center text-2xl">
			Total:{' '}
			{isPending ? (
				<Skeleton className="mt-1 ml-4 h-5 w-1/3" />
			) : (
				<>{convertCentsToCurrencyString(data?.total ?? 0)}</>
			)}
		</span>
	)
}

export const WalletList = () => {
	const { data } = useWalletsTotal()

	return <div>{JSON.stringify(data?.wallets)}</div>
}
