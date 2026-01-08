import { useState } from 'react'
import { ArrowBigRight, EllipsisVertical, Pencil, Trash } from 'lucide-react'

import type { ListMovementItemDto } from '@/core/contracts'

import { capitalizeFirst, cn, convertCentsToCurrencyString } from '@/common/lib/utils'
import { Button } from '@/common/components/ui/button'
import {
	DropDrawer,
	DropDrawerContent,
	DropDrawerGroup,
	DropDrawerItem,
	DropDrawerTrigger,
} from '@/common/components/ui/dropdrawer'

import { CategoryType } from '@/features/categories/domain'
import { CategoryIcon, CategoryName } from '@/features/categories/queries/detail-category/client'
import { usePeriodMovements } from '@/features/movements/queries/list-movements/client/query-store'
import { WalletIcon } from '@/features/wallets/queries/detail-wallet/client'
import { DeleteMovementDialog } from '@/features/movements/commands/delete-movement/client'
import { EditMovementDialog } from '@/features/movements/commands/edit-movement/client'

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
	const [openEdit, setOpenEdit] = useState<boolean>(false)
	const [openDelete, setOpenDelete] = useState<boolean>(false)

	return (
		<div className="flex min-w-0 items-center gap-4 border-b-1 py-4 last:border-b-0">
			{/* Icon */}
			<CategoryIcon className="h-10 w-10 md:h-16 md:w-16" category={movement.category} />

			{/* Info */}
			<div className="flex-1">
				{/* Top row */}
				<div className="txt-sm flex justify-between font-bold md:text-2xl">
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
							<WalletIcon className="h-5 w-5 md:h-6 md:w-6" walletId={movement.wallet.originId} />
						)}
						{movement.wallet.originId && movement.wallet.destinationId && (
							<ArrowBigRight className="h-5 w-5 md:h-6 md:w-6" />
						)}
						{movement.wallet.destinationId && (
							<WalletIcon
								className="h-5 w-5 md:h-6 md:w-6"
								walletId={movement.wallet.destinationId}
							/>
						)}
					</div>

					{/*	Description */}
					<span className="flex-1 pl-2">{capitalizeFirst(movement.description)}</span>

					{/* Date */}
					<span>{convertIsoDate(movement.date)}</span>
				</div>
			</div>

			{/* Menu */}
			<DropDrawer>
				{/*	Button */}
				<DropDrawerTrigger asChild>
					<Button variant="secondary" size="icon-sm" className="md:ml-3">
						<EllipsisVertical />
					</Button>
				</DropDrawerTrigger>

				{/*	Menu content */}
				<DropDrawerContent align="start">
					<DropDrawerGroup>
						<DropDrawerItem onClick={() => setOpenEdit(true)} icon={<Pencil />}>
							<span>Edit Movement</span>
						</DropDrawerItem>
						<DropDrawerItem
							onClick={() => setOpenDelete(true)}
							icon={<Trash />}
							variant="destructive">
							<span>Delete Movement</span>
						</DropDrawerItem>
					</DropDrawerGroup>
				</DropDrawerContent>

				{/* Forms	*/}
				<EditMovementDialog id={movement.id} open={openEdit} setOpen={setOpenEdit} />
				<DeleteMovementDialog id={movement.id} open={openDelete} setOpen={setOpenDelete} />
			</DropDrawer>
		</div>
	)
}
