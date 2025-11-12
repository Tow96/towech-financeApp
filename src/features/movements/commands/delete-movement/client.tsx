import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { DeleteMovementSchema } from './dto'
import { deleteMovement } from './server'

import { FormDialog } from '@/common/components/form-dialog'
import { movementKeys } from '@/features/movements/store-keys.ts'
import { walletKeys } from '@/features/wallets/store-keys.ts'

const useDeleteMovementMutation = () => {
	return useMutation({
		mutationFn: (data: DeleteMovementSchema) => deleteMovement({ data }),
		onSuccess: async (_, data, __, context) => {
			await Promise.all([
				context.client.invalidateQueries({ queryKey: walletKeys.all }),
				context.client.invalidateQueries({ queryKey: movementKeys.lists() }),
				context.client.invalidateQueries({ queryKey: movementKeys.detail(data.id) }),
			])
		},
	})
}

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
			loading={deleteMovementMutation.isPending}
		>
			<p>This cannot be undone</p>
			<p>Are you sure?</p>
		</FormDialog>
	)
}
