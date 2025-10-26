import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { archiveCategory } from './server.ts'
import { ArchiveCategorySchema } from './dto'

import { FormDialog } from '@/common/components/form-dialog'
import { categoryKeys } from '@/features/categories/store-keys'

const useArchiveCategoryMutation = () => {
	return useMutation({
		mutationFn: (data: ArchiveCategorySchema) => archiveCategory({ data }),
		onSuccess: async (result, _, __, context) => {
			await context.client.invalidateQueries({ queryKey: categoryKeys.list(result.type) })
			context.client.setQueryData(categoryKeys.detail(result.type, result.id, result.subId), result)
		},
	})
}

interface ArchiveCategoryDialogProps {
	id: string
	open: boolean
	setOpen: (open: boolean) => void
}

export const ArchiveCategoryDialog = (props: ArchiveCategoryDialogProps) => {
	const archiveCategoryMutation = useArchiveCategoryMutation()

	const form = useForm<ArchiveCategorySchema>({
		resolver: zodResolver(ArchiveCategorySchema),
		defaultValues: { id: props.id },
	})

	const onSubmit = (values: ArchiveCategorySchema) =>
		archiveCategoryMutation.mutate(values, { onSettled: () => props.setOpen(false) })

	return (
		<FormDialog
			open={props.open}
			setOpen={props.setOpen}
			title="Archive category"
			form={form}
			onSubmit={onSubmit}
			error={archiveCategoryMutation.error}
			loading={archiveCategoryMutation.isPending}>
			<p>
				Once archived, no new movements or budgets under this category can be made until it is
				restored.
			</p>
			<p>Are you sure?</p>
		</FormDialog>
	)
}
