import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
	FormControl,
	FormDialog,
	FormField,
	FormItem,
	FormLabel,
	IconSelector,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './base'

import type { CategoryType } from '@/core/domain'

import { capitalizeFirst } from '@/ui/utils'
import { useCategoryDetail, useEditCategoryMutation } from '@/ui/data-access'

import { EditCategoryRequest } from '@/core/dto'

interface EditCategoryDialogProps {
	type: CategoryType
	id: string
	subId?: string
	open: boolean
	setOpen: (open: boolean) => void
}

export const EditCategoryDialog = (props: EditCategoryDialogProps) => {
	const categoryDetail = useCategoryDetail(props.type, props.id, props.subId)
	const editCategoryMutation = useEditCategoryMutation()

	const form = useForm<EditCategoryRequest>({
		resolver: zodResolver(EditCategoryRequest),
		defaultValues: { type: props.type, id: props.id, subId: props.subId },
	})

	const onSubmit = (values: EditCategoryRequest) =>
		editCategoryMutation.mutate(values, {
			onSuccess: () => {
				form.reset()
				props.setOpen(false)
			},
		})

	return (
		<FormDialog
			open={props.open}
			setOpen={props.setOpen}
			title="Edit category"
			form={form}
			onSubmit={onSubmit}
			error={editCategoryMutation.error}
			loading={editCategoryMutation.isPending}>
			{/*	Form content */}
			<div className="flex items-center gap-5 py-5">
				{/*	Icon */}
				<FormField
					control={form.control}
					disabled={editCategoryMutation.isPending}
					name="iconId"
					render={({ field }) => (
						<IconSelector {...field} value={field.value ?? categoryDetail.data?.iconId} />
					)}
				/>

				{/* Inputs*/}
				<div className="grid flex-1 gap-3">
					{/*	Type (read-only) */}
					{!props.subId && (
						<Select defaultValue="base" disabled={true}>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="base">{capitalizeFirst(props.type.toLowerCase())}</SelectItem>
							</SelectContent>
						</Select>
					)}

					{/*	Name */}
					<FormField
						control={form.control}
						disabled={editCategoryMutation.isPending}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input {...field} value={field.value ?? categoryDetail.data?.name} />
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
			</div>
		</FormDialog>
	)
}
