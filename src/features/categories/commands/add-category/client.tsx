import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { addCategory } from './server'
import { AddCategorySchema } from './dto'

import { Button } from '@/common/components/ui/button'
import { CategoryType } from '@/features/categories/domain'
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
import { categoryKeys } from '@/features/categories/store-keys.ts'

const useAddCategoryMutation = () => {
	return useMutation({
		mutationFn: (data: AddCategorySchema) => addCategory({ data }),
		onSuccess: async (result, _, __, context) => {
			await context.client.invalidateQueries({ queryKey: categoryKeys.list(result.type) })
			context.client.setQueryData(categoryKeys.detail(result.type, result.id, result.subId), result)
		},
	})
}

export const AddCategoryButton = () => {
	const [open, setOpen] = useState(false)
	const addCategoryMutation = useAddCategoryMutation()

	const form = useForm<AddCategorySchema>({
		resolver: zodResolver(AddCategorySchema),
		defaultValues: {
			name: '',
			iconId: 0,
		},
	})

	const onSubmit = (values: AddCategorySchema) => {
		addCategoryMutation.mutate(values, {
			onSuccess: () => {
				form.reset()
				setOpen(false)
			},
		})
	}

	return (
		<>
			<Button onClick={() => setOpen(true)}>
				<Plus />
				Add Category
			</Button>
			<FormDialog
				open={open}
				setOpen={setOpen}
				title="Add Category"
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
		</>
	)
}
