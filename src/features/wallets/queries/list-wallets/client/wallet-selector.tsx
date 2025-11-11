import { useState } from 'react'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/common/components/ui/select'
import { Icon } from '@/common/components/icon'
import { cn, convertCentsToCurrencyString } from '@/common/lib/utils.ts'

import { useWalletsTotal } from '@/features/wallets/queries/list-wallets/client/query-store'

interface WalletSelectorProps {
	className?: string
	selectedWalletId?: string
	setSelectedWalletId?: (v: string) => void
}

export const WalletSelector = (props: WalletSelectorProps) => {
	const wallets = useWalletsTotal()
	const [selectedWalletId, setSelectedWalletId] = useState<string | undefined>('total')

	const handleValueChange = (v: string) => {
		if (props.setSelectedWalletId) props.setSelectedWalletId(v)
		else setSelectedWalletId(v)
	}

	return (
		<Select value={props.selectedWalletId ?? selectedWalletId} onValueChange={handleValueChange}>
			<SelectTrigger className={props.className}>
				<SelectValue placeholder=""></SelectValue>
				<SelectContent>
					<SelectItem value="total" className="border-b-1 py-2 last:border-b-0">
						<Icon id={0} name="Total" className="h-12 w-12 rounded-full" />
						<div className="flex min-w-0 flex-1 flex-col">
							<span className="truncate text-xl font-bold">Total</span>
							<span
								className={cn(
									'text-lg font-semibold',
									(wallets.data?.total ?? 0) < 0 ? 'text-destructive' : 'text-muted-foreground',
								)}>
								{convertCentsToCurrencyString(wallets.data?.total ?? 0)}
							</span>
						</div>
					</SelectItem>

					{wallets.data?.wallets
						.filter(w => !w.archived)
						.map(wallet => (
							<SelectItem
								key={wallet.id}
								value={wallet.id}
								className="border-b-1 py-2 last:border-b-0">
								<Icon id={wallet.iconId} name={wallet.name} className="h-12 w-12 rounded-full" />
								<div className="flex min-w-0 flex-1 flex-col">
									<span className="truncate text-xl font-bold">{wallet.name}</span>
									<span
										className={cn(
											'text-lg font-semibold',
											wallet.money < 0 ? 'text-destructive' : 'text-muted-foreground',
										)}>
										{convertCentsToCurrencyString(wallet.money)}
									</span>
								</div>
							</SelectItem>
						))}
				</SelectContent>
			</SelectTrigger>
		</Select>
	)
}
