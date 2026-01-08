import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { AddMovementSchema } from '@/core/contracts'
import { addMovement } from '@/core/functions'

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/common/components/ui/form'
import { FormDialog } from '@/common/components/form-dialog'
import { Input } from '@/common/components/ui/input'
import { Datepicker } from '@/common/components/datepicker'

import { CategoryType } from '@/core/entities'
import { CategorySelector } from '@/features/categories/queries/list-categories/client'
import { movementKeys } from '@/features/movements/store-keys'
import { walletKeys } from '@/features/wallets/store-keys'
import { WalletSelector } from '@/features/wallets/queries/list-wallets/client'

const useAddMovementMutation = () => {
	return useMutation({
		mutationFn: async (data: AddMovementSchema) => addMovement({ data }),
		onSuccess: async (result, _, __, context) => {
			await Promise.all([
				context.client.invalidateQueries({ queryKey: walletKeys.all }),
				context.client.invalidateQueries({ queryKey: movementKeys.lists() }),
			])
			context.client.setQueryData(movementKeys.detail(result.id), result)
		},
	})
}

interface AddMovementDialogProps {
	open: boolean
	setOpen: (open: boolean) => void
}

const defaultValues = (date?: Date): AddMovementSchema => ({
	amount: '',
	description: '',
	date: date ?? new Date(),
	category: { type: CategoryType.expense, id: null, subId: null },
	wallet: { originId: undefined, destinationId: undefined },
})

export const AddMovementDialog = (props: AddMovementDialogProps) => {
	const addMovementMutation = useAddMovementMutation()

	const form = useForm<AddMovementSchema>({
		resolver: zodResolver(AddMovementSchema),
		defaultValues: defaultValues(),
	})

	const onSubmit = (values: AddMovementSchema) =>
		addMovementMutation.mutate(values, {
			onSuccess: () => {
				const lastDate = new Date(form.watch().date)
				form.reset(defaultValues(lastDate))
				props.setOpen(false)
			},
		})

	return (
		<FormDialog
			open={props.open}
			setOpen={props.setOpen}
			title="Add movement"
			form={form}
			onSubmit={onSubmit}
			error={null}
			loading={false}>
			{/*	Amount */}
			<FormField
				disabled={addMovementMutation.isPending}
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
				disabled={addMovementMutation.isPending}
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
			{form.watch().category.type === CategoryType.expense && (
				<FormField
					disabled={addMovementMutation.isPending}
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
			{form.watch().category.type === CategoryType.income && (
				<FormField
					disabled={addMovementMutation.isPending}
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
			{form.watch().category.type === CategoryType.transfer && (
				<div className="flex gap-2">
					<FormField
						disabled={addMovementMutation.isPending}
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
						disabled={addMovementMutation.isPending}
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
				disabled={addMovementMutation.isPending}
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
				disabled={addMovementMutation.isPending}
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
