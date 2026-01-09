import { useMutation, useQuery } from '@tanstack/react-query'

import type { AddMovementSchema, DeleteMovementSchema, EditMovementSchema } from '@/core/contracts'

import { movementKeys, walletKeys } from '@/ui/utils'
import {
	addMovement,
	deleteMovement,
	editMovement,
	getMovementDetail,
	getMovementList,
} from '@/core/functions'

// Queries --------------------------------------
export const useMovementDetail = (id: string) => {
	return useQuery({
		queryKey: movementKeys.detail(id),
		staleTime: 60000,
		queryFn: () => getMovementDetail({ data: { id } }),
	})
}

export const useMovements = (walletId: string | undefined, start: Date) => {
	return useQuery({
		queryKey: movementKeys.list(walletId, start),
		staleTime: 60000,
		queryFn: () => getMovementList({ data: { walletId, periodStart: start } }),
	})
}

// Mutations ------------------------------------
export const useAddMovementMutation = () => {
	return useMutation({
		mutationFn: async (data: AddMovementSchema) => addMovement({ data }),
		onSuccess: async (result, _, __, context) => {
			await Promise.all([
				context.client.invalidateQueries({ queryKey: walletKeys.all }),
				context.client.invalidateQueries({ queryKey: movementKeys.lists() }),
			])
			context.client.setQueryData(movementKeys.detail(result.id), result)
		},
	})
}

export const useDeleteMovementMutation = () => {
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

export const useEditMovementMutation = () => {
	return useMutation({
		mutationFn: (data: EditMovementSchema) => editMovement({ data }),
		onSuccess: async (result, _, __, context) => {
			await Promise.all([
				context.client.invalidateQueries({ queryKey: walletKeys.all }),
				context.client.invalidateQueries({ queryKey: movementKeys.all }),
			])
			context.client.setQueryData(movementKeys.detail(result.id), result)
		},
	})
}
