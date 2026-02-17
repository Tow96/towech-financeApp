import { useState } from 'react'
import { Archive, ArchiveRestore, Ellipsis, Pencil } from 'lucide-react'

import {
	Button,
	DropDrawer,
	DropDrawerContent,
	DropDrawerGroup,
	DropDrawerItem,
	DropDrawerTrigger,
	Icon,
	Skeleton,
} from './base'
import { EditWalletDialog } from './wallet-edit-dialog'
import { SetWalletStatusDialog } from './wallet-set-status-dialog'

import type { ListWalletItemDto } from '@/core/dto'

import { useWallets } from '@/ui/data-access'
import { capitalizeFirst, cn, convertCentsToCurrencyString } from '@/ui/utils'

export const WalletsTotal = () => {
	const { data, isPending } = useWallets()
	return (
		<span className="flex w-full flex-1 items-center text-2xl">
			Total:{' '}
			{isPending ? (
				<Skeleton className="mt-1 ml-4 h-5 w-1/3" />
			) : (
				<>{convertCentsToCurrencyString(data?.total ?? 0)}</>
			)}
		</span>
	)
}

export const WalletList = () => {
	const { data } = useWallets()

	return (
		<div className="max-h-[70vh] overflow-y-auto">
			{data?.wallets.map(w => (
				<WalletItem key={w.id} wallet={w} />
			))}
		</div>
	)
}

interface WalletItemProps {
	wallet: ListWalletItemDto
}

const WalletItem = ({ wallet }: WalletItemProps) => {
	const [openStatus, setOpenStatus] = useState(false)
	const [openEdit, setOpenEdit] = useState(false)

	return (
		<div className="flex gap-4 border-b-1 py-4 pr-4 last:border-b-0">
			<Icon
				className={cn('h-16 w-16 rounded-full', wallet.archived ? 'opacity-50' : '')}
				id={wallet.iconId}
				name={wallet.name}
			/>
			<div className={cn('min-w-0 flex-1', wallet.archived ? 'opacity-50' : '')}>
				<div className="truncate overflow-hidden text-xl font-bold text-nowrap text-ellipsis">
					{capitalizeFirst(wallet.name)}
				</div>
				<span
					className={cn(
						'text-lg font-semibold',
						wallet.money < 0 ? 'text-destructive' : 'text-muted-foreground',
					)}>
					{convertCentsToCurrencyString(wallet.money)}
				</span>
			</div>

			{/*	Menu */}
			<DropDrawer>
				{/* Button */}
				<DropDrawerTrigger asChild>
					<Button variant="secondary" size="icon" className="ml-3">
						<Ellipsis />
					</Button>
				</DropDrawerTrigger>

				{/* Content	*/}
				<DropDrawerContent align="start">
					{!wallet.archived && (
						<DropDrawerGroup>
							<DropDrawerItem icon={<Pencil />} onClick={() => setOpenEdit(true)}>
								<span>Edit wallet</span>
							</DropDrawerItem>
							<DropDrawerItem
								icon={<Archive />}
								variant="destructive"
								onClick={() => setOpenStatus(true)}
								disabled={wallet.money !== 0}>
								<span>Archive wallet</span>
							</DropDrawerItem>
						</DropDrawerGroup>
					)}
					{wallet.archived && (
						<DropDrawerGroup>
							<DropDrawerItem icon={<ArchiveRestore />} onClick={() => setOpenStatus(true)}>
								<span>Restore wallet</span>
							</DropDrawerItem>
						</DropDrawerGroup>
					)}
				</DropDrawerContent>
			</DropDrawer>

			{/* Forms	*/}
			<SetWalletStatusDialog
				id={wallet.id}
				archive={!wallet.archived}
				open={openStatus}
				setOpen={setOpenStatus}
			/>
			<EditWalletDialog id={wallet.id} open={openEdit} setOpen={setOpenEdit} />
		</div>
	)
}
