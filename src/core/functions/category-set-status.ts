import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { CategoryType } from '@/core/entities'
import type { CategoryDetailDto } from '@/core/contracts'

import { SetCategoryStatusSchema } from '@/core/contracts'

import { CategoryRepository } from '@/database/repositories'

export const setCategoryStatus = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(SetCategoryStatusSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		const repository = new CategoryRepository()

		// The "parent" category has the data regarding the owner, so we fetch it first
		const parentCategory = await repository.getCategory(data.id)
		if (!parentCategory || parentCategory.userId !== userId)
			throw new Response('Category not found', { status: 404 })

		if (data.subId === undefined) {
			logger.info(`User: ${userId} setting status for parent category: ${data.id}`)
			return setParentCategoryStatus(repository, data)
		}

		logger.info(`User: ${userId} setting status for sub category: ${data.subId}`)
		return setSubCategoryStatus(repository, data, parentCategory.type as CategoryType)
	})

const setParentCategoryStatus = async (
	repository: CategoryRepository,
	category: SetCategoryStatusSchema,
) => {
	const updatedCategory = await repository.setCategoryArchive(category.id, category.archived)

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

const setSubCategoryStatus = async (
	repository: CategoryRepository,
	category: SetCategoryStatusSchema,
	type: CategoryType,
) => {
	const existingSubCategory = await repository.getSubCategory(category.id, category.subId!)
	if (!existingSubCategory) throw new Response(`Sub category not found`, { status: 404 })

	const updatedSubCategory = await repository.setSubCategoryArchive(
		category.id,
		category.subId!,
		category.archived,
	)

	const output: CategoryDetailDto = {
		iconId: updatedSubCategory.iconId,
		type,
		id: category.id,
		subId: updatedSubCategory.id,
		name: updatedSubCategory.name,
		archived: updatedSubCategory.archivedAt !== null,
	}
	return output
}
