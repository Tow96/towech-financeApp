import { and, eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { EditCategorySchema } from './dto'
import type { CategoryType } from '@/features/categories/domain'
import type { CategoryDetailDto } from '@/features/categories/queries/detail-category/dto.ts'

import { db, schema } from '@/integrations/drizzle-db'
import { AuthorizationMiddleware } from '@/integrations/clerk'

export const editCategory = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(EditCategorySchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		// The "parent" category has the data regarding the owner, so we fetch it first
		const categories = await db
			.select()
			.from(schema.Categories)
			.where(eq(schema.Categories.id, data.id))

		if (categories.length === 0) throw new Response('Category not found', { status: 404 })
		if (categories[0].userId !== userId) throw new Response('Unauthorized', { status: 403 })

		if (data.subId === undefined) {
			logger.info(`User: ${userId} editing category: ${data.id}`)
			const updatedCategory = (
				await db
					.update(schema.Categories)
					.set({
						name: data.name ?? categories[0].name,
						iconId: data.iconId ?? categories[0].iconId,
						updatedAt: new Date(),
					})
					.where(eq(schema.Categories.id, data.id))
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

		const subCategories = await db
			.select()
			.from(schema.SubCategories)
			.where(
				and(eq(schema.SubCategories.parentId, data.id), eq(schema.SubCategories.id, data.subId)),
			)
		if (subCategories.length === 0) throw new Response('Subcategory not found', { status: 404 })

		logger.info(`User: ${userId} editing subcategory: ${data.subId}`)
		const updatedSubCategory = (
			await db
				.update(schema.SubCategories)
				.set({
					name: data.name ?? subCategories[0].name,
					iconId: data.iconId ?? subCategories[0].iconId,
					updatedAt: new Date(),
				})
				.where(
					and(eq(schema.SubCategories.parentId, data.id), eq(schema.SubCategories.id, data.subId)),
				)
				.returning()
		)[0]

		const subOutput: CategoryDetailDto = {
			iconId: updatedSubCategory.iconId,
			type: categories[0].type as CategoryType,
			id: updatedSubCategory.parentId,
			subId: updatedSubCategory.id,
			name: updatedSubCategory.name,
			archived: updatedSubCategory.archivedAt !== null,
		}
		return subOutput
	})
