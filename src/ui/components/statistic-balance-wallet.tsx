import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './base'
import { WalletIcon } from './wallet-icon'
import { WalletName } from './wallet-name'

import type { BalancePerWalletStatisticDto } from '@/core/dto'

import { useBalancePerWalletStatistic } from '@/ui/data-access'
import { cn, convertCentsToCurrencyString } from '@/ui/utils'

interface BalancePerWalletStatisticProps {
	className?: string
	period: { start: Date; end: Date }
}

export const BalancePerWalletStatistic = ({
	className,
	period,
}: BalancePerWalletStatisticProps) => {
	const query = useBalancePerWalletStatistic(period.end)

	const total = (query.data ?? []).reduce((prev, curr) => prev + curr.total, 0)
	const highest = Math.max(...(query.data ?? []).map(x => Math.abs(x.total)))

	const positiveBalance = (query.data ?? [])
		.filter(x => x.total > 0)
		.sort((a, b) => -1 * (a.total - b.total))

	const negativeBalance = (query.data ?? [])
		.filter(x => x.total < 0)
		.sort((a, b) => a.total - b.total)

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Balance per wallet</CardTitle>
				<CardDescription>Where is most of my money located?</CardDescription>
			</CardHeader>
			<CardContent>
				<span className="text-lg">Total: {convertCentsToCurrencyString(total)}</span>
				{positiveBalance.map(x => (
					<WalletBalanceBar key={x.walletId} data={x} highest={highest} />
				))}
				{negativeBalance.length > 0 && (
					<>
						<div className="pt-4 text-lg">Negative balance</div>
						{negativeBalance.map(x => (
							<WalletBalanceBar key={x.walletId} data={x} highest={highest} negative />
						))}
					</>
				)}
			</CardContent>
		</Card>
	)
}

interface walletBalanceBar {
	data: BalancePerWalletStatisticDto
	highest: number
	negative?: boolean
}
const WalletBalanceBar = ({ data, highest, negative }: walletBalanceBar) => {
	return (
		<div>
			<div className="flex justify-between pt-3">
				<div className="flex pb-1 align-middle">
					<WalletIcon className="h-6" walletId={data.walletId} />
					<WalletName walletId={data.walletId} />
				</div>
				<span>{convertCentsToCurrencyString(data.total)}</span>
			</div>
			<div className="bg-muted flex rounded-sm">
				<div
					className={cn('h-6 rounded-sm', negative ? 'bg-chart-1' : 'bg-chart-6')}
					style={{ width: `${Math.max((Math.abs(data.total) / highest) * 100, 1)}%` }}
				/>
			</div>
		</div>
	)
}

