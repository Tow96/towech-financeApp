import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { AddWalletSchema } from '@/core/contracts'
import { addWallet } from '@/core/functions'

import { FormDialog } from '@/common/components/form-dialog'
import { Input } from '@/common/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel } from '@/common/components/ui/form'
import { IconSelector } from '@/common/components/icon-selector'
import { walletKeys } from '@/features/wallets/store-keys'

const useAddWalletMutation = () => {
	return useMutation({
		mutationFn: (data: AddWalletSchema) => addWallet({ data }),
		onSuccess: async (result, _, __, context) => {
			await context.client.invalidateQueries({ queryKey: walletKeys.list() })
			context.client.setQueryData(walletKeys.detail(result.id), result)
		},
	})
}

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
