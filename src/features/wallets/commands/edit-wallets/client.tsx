import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { EditWalletSchema } from './dto'
import { editWallet } from './server'

import { FormDialog } from '@/common/components/form-dialog'
import { IconSelector } from '@/common/components/icon-selector'
import { FormControl, FormField, FormItem, FormLabel } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { walletKeys } from '@/features/wallets/store-keys'
import { useWalletDetail } from '@/features/wallets/queries/detail-wallet/client'

const useEditWalletMutation = () => {
	return useMutation({
		mutationFn: (data: EditWalletSchema) => editWallet({ data }),
		onSuccess: async (result, _, __, context) => {
			await context.client.invalidateQueries({ queryKey: walletKeys.list() })
			context.client.setQueryData(walletKeys.detail(result.id), result)
		},
	})
}

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
								<Input {...field} value={field.value ?? editWalletMutation.data?.name} />
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
		</FormDialog>
	)
}
