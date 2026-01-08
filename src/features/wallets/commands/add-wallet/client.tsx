import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
	FormControl,
	FormDialog,
	FormField,
	FormItem,
	FormLabel,
	IconSelector,
	Input,
} from '@/ui/components'
import { useAddWalletMutation } from '@/ui/data-access'

import { AddWalletSchema } from '@/core/contracts'

interface AddWalletDialogProps {
	open: boolean
	setOpen: (open: boolean) => void
}

export const AddWalletDialog = (props: AddWalletDialogProps) => {
	const addWalletMutation = useAddWalletMutation()

	const form = useForm<AddWalletSchema>({
		resolver: zodResolver(AddWalletSchema),
		defaultValues: {
			name: '',
			iconId: 0,
		},
	})

	const onSubmit = (values: AddWalletSchema) =>
		addWalletMutation.mutate(values, {
			onSuccess: () => {
				form.reset()
				props.setOpen(false)
			},
		})

	return (
		<FormDialog
			open={props.open}
			setOpen={props.setOpen}
			title="Add wallet"
			form={form}
			onSubmit={onSubmit}
			error={addWalletMutation.error}
			loading={addWalletMutation.isPending}>
			<div className="flex items-center gap-5 py-5">
				{/* Icon */}
				<FormField
					control={form.control}
					disabled={addWalletMutation.isPending}
					name="iconId"
					render={({ field }) => <IconSelector {...field} />}
				/>

				{/*	Name */}
				<FormField
					control={form.control}
					disabled={addWalletMutation.isPending}
					name="name"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
		</FormDialog>
	)
}
