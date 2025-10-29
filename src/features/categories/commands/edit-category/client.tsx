import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { editCategory } from './server'
import { EditCategorySchema } from './dto'
import type { CategoryType } from '@/features/categories/domain'

import { FormDialog } from '@/common/components/form-dialog'
import { FormControl, FormField, FormItem, FormLabel } from '@/common/components/ui/form'
import { IconSelector } from '@/common/components/icon-selector'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/common/components/ui/select'
import { capitalizeFirst } from '@/common/lib/utils'
import { Input } from '@/common/components/ui/input'
import { categoryKeys } from '@/features/categories/store-keys'
import { useCategoryDetail } from '@/features/categories/queries/detail-category/client'

const useEditCategoryMutation = () => {
	return useMutation({
		mutationFn: (data: EditCategorySchema) => editCategory({ data }),
		onSuccess: async (result, _, __, context) => {
			await context.client.invalidateQueries({ queryKey: categoryKeys.list(result.type) })
			context.client.setQueryData(categoryKeys.detail(result.type, result.id, result.subId), result)
		},
	})
}

interface EditCategoryDialogProps {
	type: CategoryType
	id: string
	open: boolean
	setOpen: (open: boolean) => void
}

export const EditCategoryDialog = (props: EditCategoryDialogProps) => {
	const categoryDetail = useCategoryDetail(props.type, props.id)
	const editCategoryMutation = useEditCategoryMutation()

	const form = useForm<EditCategorySchema>({
		resolver: zodResolver(EditCategorySchema),
		defaultValues: { id: props.id },
	})

	const onSubmit = (values: EditCategorySchema) =>
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
						<IconSelector
							{...field}
							value={field.value ?? categoryDetail.data?.iconId}
						/>
					)}
				/>

				{/* Inputs*/}
				<div className="grid flex-1 gap-3">
					{/*	Type (read-only) */}
					<Select defaultValue="base" disabled={true}>
						<SelectTrigger className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="base">{capitalizeFirst(props.type.toLowerCase())}</SelectItem>
						</SelectContent>
					</Select>

					{/*	Name */}
					<FormField
						control={form.control}
						disabled={editCategoryMutation.isPending}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value ?? categoryDetail.data?.name}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
			</div>
		</FormDialog>
	)
}
