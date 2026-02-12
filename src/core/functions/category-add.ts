import { v4 as uuidV4 } from 'uuid'
import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { CategoryType } from '@/core/entities'
import type { CategoryDetailDto } from '@/core/contracts'

import { AddCategorySchema } from '@/core/contracts'

import { CategoryRepository } from '@/database/repositories'

export const addCategory = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(AddCategorySchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		const repository = new CategoryRepository()

		if (data.id === undefined) {
			logger.info(`User: ${userId} trying to add category ${data.name} of type ${data.type}`)
			return createCategory(repository, data, userId)
		}

		logger.info(`User: ${userId} trying to add subcategory ${data.name} to id ${data.id}`)
		return createSubCategory(repository, data, userId)
	})

const createCategory = async (
	repository: CategoryRepository,
	category: AddCategorySchema,
	userId: string,
) => {
	if (await repository.categoryExistsByName(userId, category.name, category.type))
		throw new Response(`Category ${category.name} already exists for type ${category.type}`, {
			status: 409,
		})

	const newCategory = await repository.insertCategory(
		userId,
		category.type,
		uuidV4(),
		category.name,
		category.iconId,
	)

	const output: CategoryDetailDto = {
		iconId: newCategory.iconId,
		type: newCategory.type as CategoryType,
		id: newCategory.id,
		subId: null,
		name: newCategory.name,
		archived: false,
	}
	return output
}

const createSubCategory = async (
	repository: CategoryRepository,
	category: AddCategorySchema,
	userId: string,
) => {
	// Check if parent category exists and it's owned by the user
	const existingParent = await repository.getCategory(category.id || '')
	if (!existingParent || existingParent.userId !== userId)
		throw new Response(`Category ${category.id} not found`, {
			status: 404,
		})

	// Check if there is a subcategory with same name under the parent category
	if (await repository.subCategoryExistsByName(category.id || '', category.name))
		throw new Response(`Subcategory ${category.name} already exists for parent ${category.id}`, {
			status: 409,
		})

	// Add the new category to the DB
	const newSubCategory = await repository.insertSubCategory(
		category.id || '',
		uuidV4(),
		category.name,
		category.iconId,
	)

	const output: CategoryDetailDto = {
		iconId: newSubCategory.iconId,
		type: category.type as CategoryType,
		id: newSubCategory.parentId,
		subId: newSubCategory.id,
		name: newSubCategory.name,
		archived: false,
	}
	return output
}
