import { and, eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { CategoryType } from '@/core/entities'
import type { CategoryDetailDto } from '@/core/contracts'

import { SetCategoryStatusSchema } from '@/core/contracts'

import { db, schema } from '@/database/utils'

export const setCategoryStatus = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(SetCategoryStatusSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		// The "parent" category has the data regarding the owner, so we fetch it first
		const categories = await db
			.select()
			.from(schema.Categories)
			.where(eq(schema.Categories.id, data.id))

		if (categories.length === 0) throw new Response('Category not found', { status: 404 })
		if (categories[0].userId !== userId) throw new Response('Unauthorized', { status: 403 })

		if (data.subId === undefined) {
			logger.info(`User: ${userId} setting status for parent category: ${data.id}`)
			return setParentCategoryStatus(data)
		}

		logger.info(`User: ${userId} setting status for sub category: ${data.subId}`)
		return setSubCategoryStatus(data, categories[0].type as CategoryType)
	})

const setParentCategoryStatus = async (category: SetCategoryStatusSchema) => {
	const updatedCategory = (
		await db
			.update(schema.Categories)
			.set({ archivedAt: category.archived ? new Date() : null })
			.where(eq(schema.Categories.id, category.id))
			.returning()
	)[0]

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

const setSubCategoryStatus = async (category: SetCategoryStatusSchema, type: CategoryType) => {
	if (category.subId === undefined) throw new Response(`Sub category not given`, { status: 422 })

	const existingSubCategory = await db
		.select({ id: schema.SubCategories.id })
		.from(schema.SubCategories)
		.where(
			and(
				eq(schema.SubCategories.parentId, category.id),
				eq(schema.SubCategories.id, category.subId),
			),
		)
	if (existingSubCategory.length === 0)
		throw new Response(`Sub category not found`, { status: 404 })

	const updatedSubCategory = (
		await db
			.update(schema.SubCategories)
			.set({ archivedAt: category.archived ? new Date() : null })
			.where(
				and(
					eq(schema.SubCategories.parentId, category.id),
					eq(schema.SubCategories.id, category.subId),
				),
			)
			.returning()
	)[0]

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
