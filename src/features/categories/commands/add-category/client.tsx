import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/common/components/ui/button'
import { CategoryType } from '@/features/categories/domain'
import { FormDialog } from '@/common/components/form-dialog'
import { FormField } from '@/common/components/ui/form'

export const AddCategoryButton = () => {
	const [open, setOpen] = useState(false)

	const formSchema = z.object({
		name: z
			.string()
			.min(2, { message: 'Name must be at least 2 characters long.' })
			.max(50, { message: 'Name cannot exceed 50 characters.' }),
		type: z.enum(CategoryType),
		iconId: z.number(),
	})
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			iconId: 0,
		},
	})

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		console.log(values)
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
				// error={addCategoryMutation.error}
				error={null}
				// loading={addCategoryMutation.isPending}
				loading={false}>
				<div className="flex items-center gap-5 py-5">
					{/*	IconId */}
					<FormField
						control={form.control}
						// disabled={addCategoryMutation.isPending}
						name="iconId"
						render={({ field }) => <AppIconSelector {...field} />}
					/>
				</div>
			</FormDialog>
		</>
	)
}
