import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { CategoryType } from '@/core/entities'
import type { CategoryDetailDto } from '@/core/contracts'

import { EditCategorySchema } from '@/core/contracts'

import { CategoryRepository } from '@/database/repositories'

export const editCategory = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(EditCategorySchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		const repository = new CategoryRepository()

		// The "parent" category has the data regarding the owner, so we fetch it first
		const parentCategory = await repository.getCategory(data.id)
		if (!parentCategory || parentCategory.userId !== userId)
			throw new Response('Category not found', { status: 404 })

		// Editing a parent category
		if (data.subId === undefined) {
			// Check if category with same name already exists
			if (data.name) {
				if (await repository.categoryExistsByName(userId, data.name, parentCategory.type))
					throw new Response(
						`Category ${data.name} already exists for type ${parentCategory.type}`,
						{ status: 409 },
					)
			}

			logger.info(`User: ${userId} editing category: ${data.id}`)
			const updatedCategory = await repository.updateCategory(
				data.id,
				data.name || parentCategory.name,
				data.iconId || parentCategory.iconId,
			)

			const output: CategoryDetailDto = {
				iconId: updatedCategory.iconId,
				type: updatedCategory.type as CategoryType,
				id: updatedCategory.id,
				subId: null,
				name: updatedCategory.name,
				archived: updatedCategory.archivedAt !== null,
			}
			return output
		}

		// Editing a subcategory ----

		// Check if subcategory exists
		const subCategory = await repository.getSubCategory(data.id, data.subId)
		if (!subCategory) throw new Response('Subcategory not found', { status: 404 })
		logger.info(`User: ${userId} editing subcategory: ${data.subId}`)

		// Check if subCategory with same name already exists
		if (data.name) {
			if (await repository.subCategoryExistsByName(parentCategory.id, data.name))
				throw new Response(
					`Subcategory ${data.name} already exists for parent ${parentCategory.id}`,
					{ status: 409 },
				)
		}

		const updatedSubCategory = await repository.updateSubCategory(
			data.id,
			data.subId,
			data.name ?? subCategory.name,
			data.iconId ?? subCategory.iconId,
		)

		const subOutput: CategoryDetailDto = {
			iconId: updatedSubCategory.iconId,
			type: parentCategory.type as CategoryType,
			id: updatedSubCategory.parentId,
			subId: updatedSubCategory.id,
			name: updatedSubCategory.name,
			archived: updatedSubCategory.archivedAt !== null,
		}
		return subOutput
	})
