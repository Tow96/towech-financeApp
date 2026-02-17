import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { FormDialog } from '@/ui/components'
import { useDeleteMovementMutation } from '@/ui/data-access'

import { DeleteMovementRequest } from '@/core/dto'

interface DeleteMovementDialogProps {
	id: string
	open: boolean
	setOpen: (o: boolean) => void
}

export const DeleteMovementDialog = (props: DeleteMovementDialogProps) => {
	const deleteMovementMutation = useDeleteMovementMutation()

	const form = useForm<DeleteMovementRequest>({
		resolver: zodResolver(DeleteMovementRequest),
		defaultValues: { id: props.id },
	})

	const onSubmit = (values: DeleteMovementRequest) =>
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
