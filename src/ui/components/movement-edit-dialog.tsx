import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2Icon, Trash } from 'lucide-react'
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
import { DeleteMovementDialog } from './movement-delete-dialog'
import { WalletSelector } from './wallet-selector'

import { useEditMovementMutation, useMovementDetail } from '@/ui/data-access'
import { convertCentsToAmount, useIsMobile } from '@/ui/utils'

import { EditMovementRequest } from '@/core/dto'
import { CategoryType } from '@/core/domain'

interface EditMovementDialogProps {
	id: string
	open: boolean
	setOpen: (o: boolean) => void
}

export const EditMovementDialog = (props: EditMovementDialogProps) => {
	const isMobile = useIsMobile()
	const [deleteModal, setDeleteModal] = useState<boolean>(false)

	return (
		<Dialog open={props.open} onOpenChange={props.setOpen}>
			<DialogContent showCloseButton={false}>
				<DialogDescription className="sr-only">Edit movement form</DialogDescription>
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between">
						Edit movement
						{isMobile && (
							<Button variant="destructive" size="icon" onClick={() => setDeleteModal(true)}>
								<Trash />
							</Button>
						)}
					</DialogTitle>
				</DialogHeader>
				<EditMovementForm id={props.id} onSubmitSuccess={() => props.setOpen(false)} />
				<DeleteMovementDialog id={props.id} open={deleteModal} setOpen={setDeleteModal} />
			</DialogContent>
		</Dialog>
	)
}

interface EditMovementFormProps {
	id: string
	onSubmitSuccess?: () => void
}

const EditMovementForm = (props: EditMovementFormProps) => {
	const movementDetail = useMovementDetail(props.id)
	const editMovementMutation = useEditMovementMutation()

	const form = useForm<EditMovementRequest>({
		resolver: zodResolver(EditMovementRequest),
		defaultValues: { id: props.id },
	})

	const onSubmit = (values: EditMovementRequest) =>
		editMovementMutation.mutate(values, {
			onSuccess: () => {
				form.reset()
				if (props.onSubmitSuccess) props.onSubmitSuccess()
			},
		})

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
				{/*	Amount */}
				<FormField
					disabled={editMovementMutation.isPending}
					control={form.control}
					name="amount"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<Input
									{...field}
									value={field.value ?? convertCentsToAmount(movementDetail.data?.amount ?? 0)}
								/>
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
							<CategorySelector {...field} value={field.value ?? movementDetail.data?.category} />
						</FormItem>
					)}
				/>

				{/*	Wallet(s) */}
				{(form.watch().category?.type ?? movementDetail.data?.category.type) ===
					CategoryType.expense && (
					<FormField
						disabled={editMovementMutation.isPending}
						control={form.control}
						name="wallet.originId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Wallet</FormLabel>
								<WalletSelector
									{...field}
									value={field.value ?? movementDetail.data?.wallet.originId ?? undefined}
								/>
							</FormItem>
						)}
					/>
				)}
				{(form.watch().category?.type ?? movementDetail.data?.category.type) ===
					CategoryType.income && (
					<FormField
						disabled={editMovementMutation.isPending}
						control={form.control}
						name="wallet.destinationId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Wallet</FormLabel>
								<WalletSelector
									{...field}
									value={field.value ?? movementDetail.data?.wallet.destinationId ?? undefined}
								/>
							</FormItem>
						)}
					/>
				)}
				{(form.watch().category?.type ?? movementDetail.data?.category.type) ===
					CategoryType.transfer && (
					<div className="flex gap-2">
						<FormField
							disabled={editMovementMutation.isPending}
							control={form.control}
							name="wallet.originId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>From</FormLabel>
									<WalletSelector
										{...field}
										value={field.value ?? movementDetail.data?.wallet.originId ?? undefined}
									/>
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
									<WalletSelector
										{...field}
										value={field.value ?? movementDetail.data?.wallet.destinationId ?? undefined}
									/>
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
							<Datepicker {...field} value={field.value ?? movementDetail.data?.date} />
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
								<Input {...field} value={field.value ?? movementDetail.data?.description} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Error box */}
				{editMovementMutation.error !== null && (
					<ErrorBox className="mb-4" title="Error" error={editMovementMutation.error} />
				)}

				{/* Form close */}
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline" disabled={editMovementMutation.isPending}>
							Cancel
						</Button>
					</DialogClose>
					<Button type="submit" disabled={editMovementMutation.isPending}>
						{editMovementMutation.isPending && <Loader2Icon className="animate-spin" />}
						Confirm
					</Button>
				</DialogFooter>
			</form>
		</Form>
	)
}
