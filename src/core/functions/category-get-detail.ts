import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { CategoryDetailDto } from '@/core/contracts'
import type { CategoryType } from '@/core/entities'

import { GetCategoryDetailSchema } from '@/core/contracts'

import { CategoryRepository } from '@/database/repositories'

export const getCategoryDetail = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetCategoryDetailSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		const repository = new CategoryRepository()
		logger.info(`User ${userId} requesting detail for category ${data.id}.${data.subId}`)

		const category = await repository.getCategory(data.id)
		if (!category || category.userId !== userId)
			throw new Response('Category not found', { status: 404 })

		let output: CategoryDetailDto = {
			iconId: category.iconId,
			type: category.type as CategoryType,
			id: category.id,
			subId: null,
			name: category.name,
			archived: category.archivedAt !== null,
		}
		if (!data.subId) return output

		const subCategory = await repository.getSubCategory(data.id, data.subId)
		if (!subCategory) throw new Response('Subcategory not found', { status: 404 })

		output = {
			iconId: subCategory.iconId,
			type: category.type as CategoryType,
			id: subCategory.parentId,
			subId: subCategory.id,
			name: subCategory.name,
			archived: subCategory.archivedAt !== null,
		}

		return output
	})
