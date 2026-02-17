import { useMutation, useQuery } from '@tanstack/react-query'

import type { AddWalletRequest, EditWalletRequest, SetWalletStatusRequest } from '@/core/dto'

import { walletKeys } from '@/ui/utils'
import {
	addWallet,
	editWallet,
	getWalletDetail,
	getWalletList,
	setWalletStatus,
} from '@/core/functions'

// Queries --------------------------------------
export const useWalletDetail = (id: string) => {
	return useQuery({
		queryKey: walletKeys.detail(id),
		staleTime: 60000,
		queryFn: () => getWalletDetail({ data: { id } }),
	})
}

export const useWallets = () => {
	return useQuery({
		queryKey: walletKeys.list(),
		staleTime: 60000,
		queryFn: () => getWalletList({ data: {} }),
	})
}

// Mutations ------------------------------------
export const useAddWalletMutation = () => {
	return useMutation({
		mutationFn: (data: AddWalletRequest) => addWallet({ data }),
		onSuccess: async (result, _, __, context) => {
			await context.client.invalidateQueries({ queryKey: walletKeys.list() })
			context.client.setQueryData(walletKeys.detail(result.id), result)
		},
	})
}

export const useEditWalletMutation = () => {
	return useMutation({
		mutationFn: (data: EditWalletRequest) => editWallet({ data }),
		onSuccess: async (result, _, __, context) => {
			await context.client.invalidateQueries({ queryKey: walletKeys.list() })
			context.client.setQueryData(walletKeys.detail(result.id), result)
		},
	})
}

export const useSetWalletStatusMutation = () => {
	return useMutation({
		mutationFn: (data: SetWalletStatusRequest) => setWalletStatus({ data }),
		onSuccess: async (result, _, __, context) => {
			await context.client.invalidateQueries({ queryKey: walletKeys.list() })
			context.client.setQueryData(walletKeys.detail(result.id), result)
		},
	})
}
