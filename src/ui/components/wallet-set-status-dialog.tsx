import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { FormDialog } from './base'

import { useSetWalletStatusMutation } from '@/ui/data-access'

import { SetWalletStatusRequest } from '@/core/dto'

interface SetWalletStatusProps {
	id: string
	archive: boolean
	open: boolean
	setOpen: (open: boolean) => void
}

export const SetWalletStatusDialog = (props: SetWalletStatusProps) => {
	const setWalletStatusMutation = useSetWalletStatusMutation()

	const form = useForm<SetWalletStatusRequest>({
		resolver: zodResolver(SetWalletStatusRequest),
		defaultValues: { id: props.id, archived: props.archive },
	})

	const onSubmit = (values: SetWalletStatusRequest) =>
		setWalletStatusMutation.mutate(values, { onSettled: () => props.setOpen(false) })

	return (
		<FormDialog
			open={props.open}
			setOpen={props.setOpen}
			title={props.archive ? 'Archive wallet' : 'Restore wallet'}
			form={form}
			onSubmit={onSubmit}
			error={setWalletStatusMutation.error}
			loading={setWalletStatusMutation.isPending}>
			{props.archive && (
				<p>
					Once archived, no new movements under this wallet can be created until is is restored.
				</p>
			)}
			<p>Are you sure?</p>
		</FormDialog>
	)
}
