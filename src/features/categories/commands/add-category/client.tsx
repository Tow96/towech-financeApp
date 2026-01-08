import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useAddCategoryMutation } from '@/ui/data-access'

import { AddCategorySchema } from '@/core/contracts'
import { CategoryType } from '@/core/entities'

import { FormDialog } from '@/common/components/form-dialog'
import { IconSelector } from '@/common/components/icon-selector'
import { FormControl, FormField, FormItem, FormLabel } from '@/common/components/ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/common/components/ui/select'
import { Input } from '@/common/components/ui/input'

interface AddCategoryDialogProps {
	open: boolean
	setOpen: (open: boolean) => void
	type?: CategoryType // If populated indicates that a subcategory will be created
	id?: string // If populated indicates that a subcategory will be created
}

export const AddCategoryDialog = (props: AddCategoryDialogProps) => {
	const addCategoryMutation = useAddCategoryMutation()

	const form = useForm<AddCategorySchema>({
		resolver: zodResolver(AddCategorySchema),
		defaultValues: {
			name: '',
			iconId: 0,
			type: props.type,
			id: props.id,
		},
	})

	const onSubmit = (values: AddCategorySchema) => {
		addCategoryMutation.mutate(values, {
			onSuccess: () => {
				form.reset()
				props.setOpen(false)
			},
		})
	}

	return (
		<FormDialog
			open={props.open}
			setOpen={props.setOpen}
			title={props.id ? 'Add Subcategory' : 'Add Category'}
			form={form}
			onSubmit={onSubmit}
			error={addCategoryMutation.error}
			loading={addCategoryMutation.isPending}>
			<div className="flex items-center gap-5 py-5">
				{/*	Icon */}
				<FormField
					control={form.control}
					disabled={addCategoryMutation.isPending}
					name="iconId"
					render={({ field }) => <IconSelector {...field} />}
				/>

				{/*	Inputs */}
				<div className="grid flex-1 gap-3">
					{/*	Type */}
					{props.id === undefined && (
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger className="w-full" disabled={addCategoryMutation.isPending}>
												<SelectValue placeholder="Select a type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value={CategoryType.income}>Income</SelectItem>
											<SelectItem value={CategoryType.expense}>Expense</SelectItem>
											<SelectItem value={CategoryType.transfer}>Transfer</SelectItem>
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
					)}

					{/*	Name */}
					<FormField
						control={form.control}
						disabled={addCategoryMutation.isPending}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
			</div>
		</FormDialog>
	)
}
