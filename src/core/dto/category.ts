import { z } from 'zod'

import type { Category } from '@/core/domain'
import { CategoryType } from '@/core/domain'

// Add ------------------------------------------------------------------------
export const AddCategoryRequest = z.object({
	name: z
		.string()
		.min(2, { message: 'Name must be at least 2 characters long.' })
		.max(50, { message: 'Name cannot exceed 50 characters.' })
		.transform(v => v.trim().toLowerCase()),
	type: z.enum(CategoryType),
	iconId: z.number(),
	id: z.uuid().optional(), // Used for subcategories
})
export type AddCategoryRequest = z.infer<typeof AddCategoryRequest>

// Detail ---------------------------------------------------------------------
export type CategoryDetailDto = {
	iconId: number
	type: CategoryType
	id: string
	subId: string | null
	name: string
	archived: boolean
}

export const mapEntityToCategoryDetail = (category: Category): CategoryDetailDto => ({
	type: category.type,
	id: category.id,
	subId: category.subId,
	iconId: category.iconId,
	name: category.name,
	archived: category.archived,
})

export const GetCategoryDetailRequest = z.object({
	type: z.enum(CategoryType),
	id: z.uuid(),
	subId: z.uuid().optional(),
})
export type GetCategoryDetailRequest = z.infer<typeof GetCategoryDetailRequest>

// List -----------------------------------------------------------------------
export type CategoryListItemDto =
	// top category
	| {
			iconId: number
			type: CategoryType
			id: string
			subId: null
			name: string
			subCategories: Array<CategoryListItemDto>
			archived: boolean
	  }
	// 	sub-category
	| {
			iconId: number
			type: CategoryType
			id: string
			subId: string
			name: string
			subCategories: null
			archived: boolean
	  }

export const GetCategoryListRequest = z.object({
	type: z.enum(CategoryType),
})
export type GetCategoryListRequest = z.infer<typeof GetCategoryListRequest>

// Edit -----------------------------------------------------------------------
export const EditCategoryRequest = z.object({
	type: z.enum(CategoryType),
	id: z.uuid(),
	subId: z.uuid().optional(),
	name: z
		.string()
		.min(2, { message: 'Name must be at least 2 characters long.' })
		.max(50, { message: 'Name cannot exceed 50 characters.' })
		.transform(v => v.trim().toLowerCase())
		.optional(),
	iconId: z.number().optional(),
})
export type EditCategoryRequest = z.infer<typeof EditCategoryRequest>

// Set status -----------------------------------------------------------------
export const SetCategoryStatusRequest = z.object({
	type: z.enum(CategoryType),
	id: z.uuid(),
	subId: z.uuid().optional(),
	archived: z.boolean(),
})
export type SetCategoryStatusRequest = z.infer<typeof SetCategoryStatusRequest>

