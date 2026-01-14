import { useState } from 'react'

import {
	Icon,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Skeleton,
} from './base'

import type { ListWalletItemDto } from '@/core/contracts'

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
		<>
			{!wallets.isPending && wallets.data?.wallets.length === 0 ? (
				<a
					href="/wallets"
					className={cn(
						'flex w-full items-center rounded-md border px-3 py-2 shadow-xs',
						props.showMoney ? 'h-16' : 'h-12',
					)}>
					Create a wallet
				</a>
			) : (
				<Select
					disabled={props.disabled}
					value={props.value ?? internalValue}
					onValueChange={handleValueChange}>
					<SelectTrigger
						className={cn('w-full', props.showMoney ? 'h-16!' : 'h-12!', props.className)}>
						<SelectValue placeholder="Select a wallet"></SelectValue>
						<SelectContent>
							{props.showTotal && (
								<SelectItem value="total" className="py2 border-b last:border-b-0">
									{wallets.isLoading ? (
										<Skeleton
											className={cn('rounded-full', props.showMoney ? 'h-13 w-13' : 'h-8 w-8')}
										/>
									) : (
										<Icon
											id={0}
											name="Total"
											className={cn(props.showMoney ? 'h-12 w-12' : 'h-8 w-8')}
										/>
									)}
									<div className="flex min-w-0 flex-1 flex-col text-left">
										<span
											className={cn(props.showMoney ? 'text-xl font-bold' : 'text-lg', 'truncate')}>
											Total
										</span>

										{props.showMoney && (
											<span
												className={cn(
													'text-left text-lg font-semibold',
													(wallets.data?.total ?? 0) < 0
														? 'text-destructive'
														: 'text-muted-foreground',
												)}>
												{wallets.isLoading ? (
													<Skeleton className="my-1.5 h-4 w-40" />
												) : (
													convertCentsToCurrencyString(wallets.data?.total ?? 0)
												)}
											</span>
										)}
									</div>
								</SelectItem>
							)}

							{wallets.isPending && (
								<>
									<SelectWalletItemSkeleton showMoney={props.showMoney} />
									<SelectWalletItemSkeleton showMoney={props.showMoney} />
								</>
							)}

							{!wallets.isPending &&
								wallets.data?.wallets
									.filter(w => !w.archived)
									.map(wallet => (
										<SelectWalletItem key={wallet.id} wallet={wallet} showMoney={props.showMoney} />
									))}
						</SelectContent>
					</SelectTrigger>
				</Select>
			)}
		</>
	)
}

interface SelectWalletItemProps {
	wallet: ListWalletItemDto
	showMoney?: boolean
}

const SelectWalletItem = ({ wallet, showMoney }: SelectWalletItemProps) => {
	return (
		<SelectItem value={wallet.id} className="border-b py-2 last:border-b-0">
			<Icon
				id={wallet.iconId}
				name={wallet.name}
				className={cn(showMoney ? 'h-12 w-12' : 'h-8 w-8')}
			/>
			<div className="flex min-w-0 flex-1 flex-col">
				<span className={cn(showMoney ? 'text-xl font-bold' : 'text-lg', 'truncate')}>
					{capitalizeFirst(wallet.name)}
				</span>
				{showMoney && (
					<span
						className={cn(
							'text-lg font-semibold',
							wallet.money < 0 ? 'text-destructive' : 'text-muted-foreground',
						)}>
						{convertCentsToCurrencyString(wallet.money)}
					</span>
				)}
			</div>
		</SelectItem>
	)
}

interface SelectWalletItemSkeleton {
	showMoney?: boolean
}
const SelectWalletItemSkeleton = ({ showMoney }: SelectWalletItemSkeleton) => (
	<div className="flex gap-2 border-b py-2 pl-2 last:border-b-0">
		<Skeleton className={cn('rounded-full', showMoney ? 'h-13 w-13' : 'h-8 w-8')} />
		<div className="flex flex-col">
			<Skeleton className={cn('my-1.5 h-4 w-40')} />
			{showMoney && <Skeleton className={cn('my-1.5 h-4 w-40')} />}
		</div>
	</div>
)
