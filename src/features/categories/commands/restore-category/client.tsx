import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { restoreCategory } from './server.ts'
import { RestoreCategorySchema } from './dto'

import { FormDialog } from '@/common/components/form-dialog'
import { categoryKeys } from '@/features/categories/store-keys'

const useRestoreCategoryMutation = () => {
	return useMutation({
		mutationFn: (data: RestoreCategorySchema) => restoreCategory({ data }),
		onSuccess: async (result, _, __, context) => {
			await context.client.invalidateQueries({ queryKey: categoryKeys.list(result.type) })
			context.client.setQueryData(categoryKeys.detail(result.type, result.id, result.subId), result)
		},
	})
}

interface RestoreCategoryDialogProps {
	id: string
	open: boolean
	setOpen: (open: boolean) => void
}

export const RestoreCategoryDialog = (props: RestoreCategoryDialogProps) => {
	const restoreCategoryMutation = useRestoreCategoryMutation()

	const form = useForm<RestoreCategorySchema>({
		resolver: zodResolver(RestoreCategorySchema),
		defaultValues: { id: props.id },
	})

	const onSubmit = (values: RestoreCategorySchema) =>
		restoreCategoryMutation.mutate(values, { onSettled: () => props.setOpen(false) })

	return (
		<FormDialog
			open={props.open}
			setOpen={props.setOpen}
			title="Restore Category"
			form={form}
			onSubmit={onSubmit}
			error={restoreCategoryMutation.error}
			loading={restoreCategoryMutation.isPending}>
			<p>Are you sure?</p>
		</FormDialog>
	)
}
