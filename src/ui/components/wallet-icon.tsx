import { useWalletDetail } from '@/ui/data-access'

import { Icon } from '@/ui/components'

interface WalletIconProps {
	className?: string
	walletId: string
}

export const WalletIcon = ({ className, walletId }: WalletIconProps) => {
	const detail = useWalletDetail(walletId)

	return <Icon className={className} id={detail.data?.iconId ?? 0} name={detail.data?.name ?? ''} />
}
