import { useWalletDetail } from '@/ui/data-access'

import { Icon } from '@/common/components/icon'

interface WalletDetailProps {
	className?: string
	walletId: string
}

export const WalletIcon = ({ className, walletId }: WalletDetailProps) => {
	const detail = useWalletDetail(walletId)

	return <Icon className={className} id={detail.data?.iconId ?? 0} name={detail.data?.name ?? ''} />
}
