import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { EditMovementSchema } from './dto'

import { FormDialog } from '@/common/components/form-dialog'
import { convertCentsToAmount } from '@/common/lib/utils.ts'
import { editMovement } from '@/features/movements/commands/edit-movement/server'
import { walletKeys } from '@/features/wallets/store-keys'
import { movementKeys } from '@/features/movements/store-keys'
import { useMovementDetail } from '@/features/movements/queries/detail-movement/client.tsx'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/common/components/ui/form.tsx'
import { Input } from '@/common/components/ui/input.tsx'
import { CategorySelector } from '@/features/categories/queries/list-categories/client'
import { CategoryType } from '@/features/categories/domain.ts'
import { WalletSelector } from '@/features/wallets/queries/list-wallets/client'
import { Datepicker } from '@/common/components/datepicker.tsx'

const useEditMovementMutation = () => {
	return useMutation({
		mutationFn: (data: EditMovementSchema) => editMovement({ data }),
		onSuccess: async (result, _, __, context) => {
			await Promise.all([
				context.client.invalidateQueries({ queryKey: walletKeys.all }),
				context.client.invalidateQueries({ queryKey: movementKeys.all }),
			])
			context.client.setQueryData(movementKeys.detail(result.id), result)
		},
	})
}

interface EditMovementDialogProps {
	id: string
	open: boolean
	setOpen: (o: boolean) => void
}

export const EditMovementDialog = (props: EditMovementDialogProps) => {
	const movementDetail = useMovementDetail(props.id)
	const editMovementMutation = useEditMovementMutation()

	const form = useForm<EditMovementSchema>({
		resolver: zodResolver(EditMovementSchema),
		defaultValues: {
			id: props.id,
			amount: convertCentsToAmount(movementDetail.data?.amount ?? 0),
			date: movementDetail.data?.date,
			description: movementDetail.data?.description,
			category: movementDetail.data?.category,
			wallet: {
				originId: movementDetail.data?.wallet.originId ?? undefined,
				destinationId: movementDetail.data?.wallet.destinationId ?? undefined,
			},
		},
	})

	const onSubmit = (values: EditMovementSchema) =>
		editMovementMutation.mutate(values, {
			onSuccess: () => {
				form.reset()
				props.setOpen(false)
			},
		})

	return (
		<FormDialog
			open={props.open}
			setOpen={props.setOpen}
			title="Edit Movement"
			form={form}
			onSubmit={onSubmit}
			error={editMovementMutation.error}
			loading={editMovementMutation.isPending}>
			{/*	Amount */}
			<FormField
				disabled={editMovementMutation.isPending}
				control={form.control}
				name="amount"
				render={({ field }) => (
					<FormItem className="flex-1">
						<FormLabel>Amount</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/*	Category */}
			<FormField
				disabled={editMovementMutation.isPending}
				control={form.control}
				name="category"
				render={({ field }) => (
					<FormItem className="flex-1">
						<FormLabel>Category</FormLabel>
						<CategorySelector {...field} />
					</FormItem>
				)}
			/>

			{/*	Wallet(s) */}
			{form.watch().category?.type === CategoryType.expense && (
				<FormField
					disabled={editMovementMutation.isPending}
					control={form.control}
					name="wallet.originId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Wallet</FormLabel>
							<WalletSelector {...field} />
						</FormItem>
					)}
				/>
			)}
			{form.watch().category?.type === CategoryType.income && (
				<FormField
					disabled={editMovementMutation.isPending}
					control={form.control}
					name="wallet.destinationId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Wallet</FormLabel>
							<WalletSelector {...field} />
						</FormItem>
					)}
				/>
			)}
			{form.watch().category?.type === CategoryType.transfer && (
				<div className="flex gap-2">
					<FormField
						disabled={editMovementMutation.isPending}
						control={form.control}
						name="wallet.originId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>From</FormLabel>
								<WalletSelector {...field} />
							</FormItem>
						)}
					/>
					<FormField
						disabled={editMovementMutation.isPending}
						control={form.control}
						name="wallet.destinationId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>To</FormLabel>
								<WalletSelector {...field} />
							</FormItem>
						)}
					/>
				</div>
			)}

			{/*	Date */}
			<FormField
				disabled={editMovementMutation.isPending}
				control={form.control}
				name="date"
				render={({ field }) => (
					<FormItem className="flex-1">
						<FormLabel>Date</FormLabel>
						<Datepicker {...field} />
					</FormItem>
				)}
			/>

			{/*	Description */}
			<FormField
				disabled={editMovementMutation.isPending}
				control={form.control}
				name="description"
				render={({ field }) => (
					<FormItem className="flex-1">
						<FormLabel>Description</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</FormDialog>
	)
}
