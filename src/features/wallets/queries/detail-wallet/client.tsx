import { useQuery } from '@tanstack/react-query'

import { getWalletDetail } from '@/core/functions'

import { Icon } from '@/common/components/icon'
import { walletKeys } from '@/features/wallets/store-keys'

export const useWalletDetail = (id: string) => {
	return useQuery({
		queryKey: walletKeys.detail(id),
		staleTime: 60000,
		queryFn: () => getWalletDetail({ data: { id } }),
	})
}

interface WalletDetailProps {
	className?: string
	walletId: string
}

export const WalletIcon = ({ className, walletId }: WalletDetailProps) => {
	const detail = useWalletDetail(walletId)

	return <Icon className={className} id={detail.data?.iconId ?? 0} name={detail.data?.name ?? ''} />
}
