import { Icon, Skeleton } from './base'

import { useWalletDetail } from '@/ui/data-access'
import { cn } from '@/ui/utils'

interface WalletIconProps {
	className?: string
	walletId: string
}

export const WalletIcon = ({ className, walletId }: WalletIconProps) => {
	const detail = useWalletDetail(walletId)

	return detail.isPending ? (
		<Skeleton className={cn('rounded-full', className)} />
	) : (
		<Icon className={className} id={detail.data?.iconId ?? 0} name={detail.data?.name ?? ''} />
	)
}
