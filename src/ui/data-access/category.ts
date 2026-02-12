import { useMutation, useQuery } from '@tanstack/react-query'

import type { AddCategoryRequest, EditCategoryRequest, SetCategoryStatusRequest } from '@/core/dto'
import type { CategoryType } from '@/core/domain'

import { categoryKeys } from '@/ui/utils'
import {
	addCategory,
	editCategory,
	getCategoriesByType,
	getCategoryDetail,
	setCategoryStatus,
} from '@/core/functions'

// Queries --------------------------------------
export const useCategoryDetail = (type: CategoryType, id: string, subId?: string) => {
	return useQuery({
		queryKey: categoryKeys.detail(type, id, subId ?? null),
		staleTime: 60000,
		queryFn: () => getCategoryDetail({ data: { type, id, subId } }),
	})
}

export const useCategoryList = (type: CategoryType) => {
	return useQuery({
		queryKey: categoryKeys.list(type),
		staleTime: 60000,
		queryFn: () => getCategoriesByType({ data: { type } }),
	})
}

// Mutations ------------------------------------
export const useAddCategoryMutation = () => {
	return useMutation({
		mutationFn: (data: AddCategoryRequest) => addCategory({ data }),
		onSuccess: async (result, _, __, context) => {
			await context.client.invalidateQueries({ queryKey: categoryKeys.list(result.type) })
			context.client.setQueryData(categoryKeys.detail(result.type, result.id, result.subId), result)
		},
	})
}

export const useEditCategoryMutation = () => {
	return useMutation({
		mutationFn: (data: EditCategoryRequest) => editCategory({ data }),
		onSuccess: async (result, _, __, context) => {
			await context.client.invalidateQueries({ queryKey: categoryKeys.list(result.type) })
			context.client.setQueryData(categoryKeys.detail(result.type, result.id, result.subId), result)
		},
	})
}

export const useSetCategoryStatusMutation = () => {
	return useMutation({
		mutationFn: (data: SetCategoryStatusRequest) => setCategoryStatus({ data }),
		onSuccess: async (result, _, __, context) => {
			await context.client.invalidateQueries({ queryKey: categoryKeys.list(result.type) })
			context.client.setQueryData(categoryKeys.detail(result.type, result.id, result.subId), result)
		},
	})
}
