import { ArrowBigRight } from 'lucide-react'
import type { ListMovementItemDto } from '../dto'

import { capitalizeFirst, cn, convertCentsToCurrencyString } from '@/common/lib/utils'
import { usePeriodMovements } from '@/features/movements/list-movements/client/query-store.ts'
import { CategoryIcon, CategoryName } from '@/features/categories/queries/detail-category/client'
import { CategoryType } from '@/features/categories/domain'
import { WalletIcon } from '@/features/wallets/queries/detail-wallet/client'

interface PeriodMovementListProps {
	selectedWalletId: string | undefined
	periodStart: Date
}

export const PeriodMovementList = (props: PeriodMovementListProps) => {
	const movements = usePeriodMovements(props.selectedWalletId, props.periodStart)

	return (
		<div>
			{movements.data?.map(m => (
				<MovementItem key={m.id} movement={m} />
			))}
		</div>
	)
}

interface MovementItemProps {
	movement: ListMovementItemDto
}

const convertIsoDate = (date: Date): string => {
	const formatter = Intl.DateTimeFormat(window.navigator.language, {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		timeZone: 'UTC',
	})

	return formatter.format(new Date(date))
}

const MovementItem = ({ movement }: MovementItemProps) => {
	return (
		<div className="flex min-w-0 items-center gap-4 border-b-1 py-4 last:border-b-0">
			<CategoryIcon className="h-16 w-16 rounded-full" category={movement.category} />
			<div className="flex-1">
				{/* Top row */}
				<div className="flex justify-between text-2xl font-bold">
					<CategoryName category={movement.category} />
					<span
						className={cn(
							movement.category.type === CategoryType.income && 'text-constructive',
							movement.category.type === CategoryType.expense && 'text-destructive',
						)}>
						{convertCentsToCurrencyString(movement.amount)}
					</span>
				</div>
				{/*	Bottom row */}
				<div className="text-muted-foreground flex justify-between">
					{/*	Origin and destination*/}
					<div className="flex">
						{movement.wallet.originId && (
							<WalletIcon className="h-6 w-6" walletId={movement.wallet.originId} />
						)}
						{movement.wallet.originId && movement.wallet.destinationId && <ArrowBigRight />}
						{movement.wallet.destinationId && (
							<WalletIcon className="h-6 w-6" walletId={movement.wallet.destinationId} />
						)}
					</div>

					{/*	Description */}
					<span className="flex-1 pl-2">{capitalizeFirst(movement.description)}</span>

					{/* Date */}
					<span>{convertIsoDate(movement.date)}</span>
				</div>
			</div>
		</div>
	)
}
