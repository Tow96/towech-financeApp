import { and, eq } from 'drizzle-orm'
import { v4 as uuidV4 } from 'uuid'
import { createServerFn } from '@tanstack/react-start'

import { AddCategorySchema } from './dto'
import type { CategoryType } from '@/features/categories/domain'
import type { CategoryDetailDto } from '@/features/categories/queries/detail-category/dto'

import { db, schema } from '@/integrations/drizzle-db'
import { AuthorizationMiddleware } from '@/integrations/clerk'

export const addCategory = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(AddCategorySchema)
	.handler(async ({ data, context: { userId, logger } }) => {

		if (data.id === undefined) {
			logger.info(`User: ${userId} trying to add category ${data.name} of type ${data.type}`)
			return createCategory(data, userId)
		}

		logger.info(`User: ${userId} trying to add subcategory ${data.name} to id ${data.id}`)
		return createSubCategory(data, userId)
	})

const createCategory = async (category: AddCategorySchema, userId: string) => {
	// Check if category already exists
	const existingCategory = await db
		.select({ id: schema.Categories.id })
		.from(schema.Categories)
		.where(
			and(
				eq(schema.Categories.userId, userId),
				eq(schema.Categories.type, category.type),
				eq(schema.Categories.name, category.name),
			),
		)
	if (existingCategory.length > 0)
		throw new Response(`Category ${category.name} already exists for type ${category.type}`, {
			status: 409,
		})

	// Add the new category to the DB
	const newCategory = (
		await db
			.insert(schema.Categories)
			.values({
				userId,
				iconId: category.iconId,
				type: category.type,
				id: uuidV4(),
				name: category.name,
				createdAt: new Date(),
				updatedAt: new Date(0),
			})
			.returning()
	)[0]

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

const createSubCategory = async (category: AddCategorySchema, userId: string) => {
	// Check if parent category exists
	const existingParent = await db
		.select({ id: schema.Categories.id })
		.from(schema.Categories)
		.where(and(eq(schema.Categories.userId, userId), eq(schema.Categories.id, category.id || '')))
	if (existingParent.length === 0)
		throw new Response(`Category ${category.id} not found`, {
			status: 404,
		})

	// Check if there is a subcategory with same name under the parent category
	const existingSubCategory = await db
		.select({ id: schema.SubCategories.id })
		.from(schema.SubCategories)
		.where(
			and(
				eq(schema.SubCategories.parentId, category.id || ''),
				eq(schema.SubCategories.name, category.name),
			),
		)
	if (existingSubCategory.length > 0)
		throw new Response(`Subcategory ${category.name} already exists for parent ${category.id}`, {
			status: 409,
		})

	// Add the new category to the DB
	const newSubCategory = (
		await db
			.insert(schema.SubCategories)
			.values({
				parentId: category.id || '',
				id: uuidV4(),
				iconId: category.iconId,
				name: category.name,
				createdAt: new Date(),
				updatedAt: new Date(0),
			})
			.returning()
	)[0]

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
