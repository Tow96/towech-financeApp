import { useForm } from 'react-hook-form'
import { Loader2Icon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'

import {
	Button,
	Datepicker,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	ErrorBox,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from './base'
import { CategorySelector } from './category-selector'
import { WalletSelector } from './wallet-selector'

import { useAddMovementMutation } from '@/ui/data-access'

import { AddMovementRequest } from '@/core/dto'
import { CategoryType } from '@/core/domain'

interface AddMovementDialogProps {
	open: boolean
	setOpen: (open: boolean) => void
}

export const AddMovementDialog = (props: AddMovementDialogProps) => {
	return (
		<Dialog open={props.open} onOpenChange={props.setOpen}>
			<DialogContent>
				<DialogDescription className="sr-only">Add movement form</DialogDescription>
				<DialogHeader>
					<DialogTitle>Add movement</DialogTitle>
				</DialogHeader>
				<AddMovementForm onSubmitSuccess={() => props.setOpen(false)} />
			</DialogContent>
		</Dialog>
	)
}

interface AddMovementFormProps {
	onSubmitSuccess?: () => void
}

const defaultValues = (date?: Date): AddMovementRequest => ({
	amount: '',
	description: '',
	date: date ?? new Date(new Date().setHours(0, 0, 0, 0)),
	category: { type: CategoryType.expense, id: null, subId: null },
	wallet: { originId: undefined, destinationId: undefined },
})

const AddMovementForm = (props: AddMovementFormProps) => {
	const addMovementMutation = useAddMovementMutation()

	const form = useForm<AddMovementRequest>({
		resolver: zodResolver(AddMovementRequest),
		defaultValues: defaultValues(),
	})

	const onSubmit = (v: AddMovementRequest) =>
		addMovementMutation.mutate(v, {
			onSuccess: () => {
				const lastDate = new Date(form.watch().date)
				form.reset(defaultValues(lastDate))
				if (props.onSubmitSuccess) props.onSubmitSuccess()
			},
		})

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
								<FormMessage />
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
								<FormMessage />
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
									<FormMessage />
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
									<FormMessage />
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

				{/* Error box */}
				{addMovementMutation.error !== null && (
					<ErrorBox className="mb-4" title="Error" error={addMovementMutation.error} />
				)}

				{/* Form close */}
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline" disabled={addMovementMutation.isPending}>
							Cancel
						</Button>
					</DialogClose>
					<Button type="submit" disabled={addMovementMutation.isPending}>
						{addMovementMutation.isPending && <Loader2Icon className="animate-spin" />}
						Confirm
					</Button>
				</DialogFooter>
			</form>
		</Form>
	)
}
