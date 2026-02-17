import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { FormDialog } from './base'

import type { CategoryType } from '@/core/domain'

import { useSetCategoryStatusMutation } from '@/ui/data-access'

import { SetCategoryStatusRequest } from '@/core/dto'

interface SetCategoryStatusProps {
	type: CategoryType
	id: string
	subId?: string
	archive: boolean
	open: boolean
	setOpen: (open: boolean) => void
}

export const SetCategoryStatusDialog = (props: SetCategoryStatusProps) => {
	const setCategoryStatusMutation = useSetCategoryStatusMutation()

	const form = useForm<SetCategoryStatusRequest>({
		resolver: zodResolver(SetCategoryStatusRequest),
		defaultValues: { type: props.type, id: props.id, subId: props.subId, archived: props.archive },
	})

	const onSubmit = (values: SetCategoryStatusRequest) =>
		setCategoryStatusMutation.mutate(values, { onSettled: () => props.setOpen(false) })

	return (
		<FormDialog
			open={props.open}
			setOpen={props.setOpen}
			title={props.archive ? 'Archive category' : 'Restore category'}
			form={form}
			onSubmit={onSubmit}
			error={setCategoryStatusMutation.error}
			loading={setCategoryStatusMutation.isPending}>
			{props.archive && (
				<p>
					Once archived, no new movements or budgets under this category can be made until it is
					restored.
				</p>
			)}
			<p>Are you sure?</p>
		</FormDialog>
	)
}
