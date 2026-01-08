import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useEditWalletMutation, useWalletDetail } from '@/ui/data-access'

import { EditWalletSchema } from '@/core/contracts'

import { FormDialog } from '@/common/components/form-dialog'
import { IconSelector } from '@/common/components/icon-selector'
import { FormControl, FormField, FormItem, FormLabel } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'

interface EditWalletDialogProps {
	id: string
	open: boolean
	setOpen: (open: boolean) => void
}

export const EditWalletDialog = (props: EditWalletDialogProps) => {
	const walletDetail = useWalletDetail(props.id)
	const editWalletMutation = useEditWalletMutation()

	const form = useForm<EditWalletSchema>({
		resolver: zodResolver(EditWalletSchema),
		defaultValues: { id: props.id },
	})

	const onSubmit = (values: EditWalletSchema) =>
		editWalletMutation.mutate(values, {
			onSuccess: () => {
				form.reset()
				props.setOpen(false)
			},
		})

	return (
		<FormDialog
			open={props.open}
			setOpen={props.setOpen}
			title="Edit wallet"
			form={form}
			onSubmit={onSubmit}
			error={editWalletMutation.error}
			loading={editWalletMutation.isPending}>
			<div className="flex items-center gap-5 py-5">
				{/*	Icon */}
				<FormField
					control={form.control}
					disabled={editWalletMutation.isPending}
					name="iconId"
					render={({ field }) => (
						<IconSelector {...field} value={field.value ?? walletDetail.data?.iconId} />
					)}
				/>

				{/*	Name */}
				<FormField
					control={form.control}
					disabled={editWalletMutation.isPending}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} value={field.value ?? walletDetail.data?.name} />
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
		</FormDialog>
	)
}
