import { useState } from 'react'

import { Icon, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './base'

import { useWallets } from '@/ui/data-access'
import { capitalizeFirst, cn, convertCentsToCurrencyString } from '@/ui/utils'

interface WalletSelectorProps {
	className?: string
	value?: string
	onChange?: (v: string) => void
	disabled?: boolean
	showTotal?: boolean
	showMoney?: boolean
}

export const WalletSelector = (props: WalletSelectorProps) => {
	const wallets = useWallets()
	const [internalValue, setInternalValue] = useState<string | undefined>(
		props.showTotal ? 'total' : undefined,
	)

	const handleValueChange = (v: string) => {
		if (props.onChange) props.onChange(v)
		else setInternalValue(v)
	}

	return (
		<Select
			disabled={props.disabled}
			value={props.value ?? internalValue}
			onValueChange={handleValueChange}>
			<SelectTrigger className={cn('w-full', props.showMoney ? '!h-16' : '!h-12', props.className)}>
				<SelectValue placeholder="Select a wallet"></SelectValue>
				<SelectContent>
					{props.showTotal && (
						<SelectItem value="total" className="py2 border-b-1 last:border-b-0">
							<Icon id={0} name="Total" className={cn(props.showMoney ? 'h-12 w-12' : 'h-8 w-8')} />
							<div className="flex min-w-0 flex-1 flex-col">
								<span className={cn(props.showMoney ? 'text-xl font-bold' : 'text-lg', 'truncate')}>
									Total
								</span>
								<span
									className={cn(
										'text-lg',
										props.showMoney && 'font-semibold',
										(wallets.data?.total ?? 0) < 0 ? 'text-destructive' : 'text-muted-foreground',
									)}>
									{props.showMoney && convertCentsToCurrencyString(wallets.data?.total ?? 0)}
								</span>
							</div>
						</SelectItem>
					)}

					{wallets.data?.wallets
						.filter(w => !w.archived)
						.map(wallet => (
							<SelectItem
								key={wallet.id}
								value={wallet.id}
								className="border-b-1 py-2 last:border-b-0">
								<Icon
									id={wallet.iconId}
									name={wallet.name}
									className={cn(props.showMoney ? 'h-12 w-12' : 'h-8 w-8')}
								/>
								<div className="flex min-w-0 flex-1 flex-col">
									<span
										className={cn(props.showMoney ? 'text-xl font-bold' : 'text-lg', 'truncate')}>
										{capitalizeFirst(wallet.name)}
									</span>
									<span
										className={cn(
											'text-lg font-semibold',
											wallet.money < 0 ? 'text-destructive' : 'text-muted-foreground',
										)}>
										{props.showMoney && convertCentsToCurrencyString(wallet.money)}
									</span>
								</div>
							</SelectItem>
						))}
				</SelectContent>
			</SelectTrigger>
		</Select>
	)
}
