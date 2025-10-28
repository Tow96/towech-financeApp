import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { editCategory } from './server.ts'
import { EditCategorySchema } from './dto'
import type { CategoryType } from '@/features/categories/domain'

import { FormDialog } from '@/common/components/form-dialog'
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
			<div>{JSON.stringify(categoryDetail.data)}</div>
		</FormDialog>
	)
}
