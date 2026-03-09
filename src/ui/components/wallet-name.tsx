import { useWalletDetail } from '../data-access'
import { capitalizeFirst, cn } from '../utils'
import { Skeleton } from './base'

interface WalletNameProps {
	className?: string
	walletId: string
}

export const WalletName = ({ className, walletId }: WalletNameProps) => {
	const detail = useWalletDetail(walletId)

	return detail.isPending ? (
		<Skeleton className={cn('mb-1 w-1/4', className)} />
	) : (
		<span className={className}>{capitalizeFirst(detail.data?.name ?? '')}</span>
	)
}
