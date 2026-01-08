import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useDeleteMovementMutation } from '@/ui/data-access'
import { DeleteMovementSchema } from '@/core/contracts'

import { FormDialog } from '@/common/components/form-dialog'

interface DeleteMovementDialogProps {
	id: string
	open: boolean
	setOpen: (o: boolean) => void
}

export const DeleteMovementDialog = (props: DeleteMovementDialogProps) => {
	const deleteMovementMutation = useDeleteMovementMutation()

	const form = useForm<DeleteMovementSchema>({
		resolver: zodResolver(DeleteMovementSchema),
		defaultValues: { id: props.id },
	})

	const onSubmit = (values: DeleteMovementSchema) =>
		deleteMovementMutation.mutate(values, { onSettled: () => props.setOpen(false) })

	return (
		<FormDialog
			open={props.open}
			setOpen={props.setOpen}
			title="Delete movement"
			form={form}
			onSubmit={onSubmit}
			error={deleteMovementMutation.error}
			loading={deleteMovementMutation.isPending}>
			<p>This cannot be undone</p>
			<p>Are you sure?</p>
		</FormDialog>
	)
}
