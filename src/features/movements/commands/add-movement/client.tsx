import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { AddMovementSchema } from './dto.ts'

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/common/components/ui/form'
import { FormDialog } from '@/common/components/form-dialog'
import { Input } from '@/common/components/ui/input'

import { CategoryType } from '@/features/categories/domain'
import { movementKeys } from '@/features/movements/store-keys'
import { walletKeys } from '@/features/wallets/store-keys'
import { Datepicker } from '@/common/components/datepicker.tsx'

const useAddMovementMutation = () => {
	return useMutation({
		mutationFn: async (data: AddMovementSchema) => {
			console.log(data)
			return false
		},
		onSuccess: async (result, _, __, context) => {
			await Promise.all([
				context.client.invalidateQueries({ queryKey: walletKeys.all }),
				context.client.invalidateQueries({ queryKey: movementKeys.lists() }),
			])
			context.client.setQueryData(movementKeys.detail('id'), result)
		},
	})
}

interface AddMovementDialogProps {
	open: boolean
	setOpen: (open: boolean) => void
}

export const AddMovementDialog = (props: AddMovementDialogProps) => {
	const addMovementMutation = useAddMovementMutation()

	const form = useForm<AddMovementSchema>({
		resolver: zodResolver(AddMovementSchema),
		defaultValues: {
			date: new Date(),
			category: { type: CategoryType.expense, id: null, subId: null },
		},
	})

	const onSubmit = (values: AddMovementSchema) => console.log(values)

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

			{/*	Wallet(s) */}

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
