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
		logger.info(`User: ${userId} trying to add category ${data.name} of type ${data.type}`)

		// Check if category already exists
		const existingCategory = await db
			.select({ id: schema.Categories.id })
			.from(schema.Categories)
			.where(
				and(
					eq(schema.Categories.userId, userId),
					eq(schema.Categories.type, data.type),
					eq(schema.Categories.name, data.name),
				),
			)
		if (existingCategory.length > 0)
			throw new Response(`Category ${data.name} already exists for type ${data.type}`, {
				status: 409,
			})

		// Add the new category to the DB
		const newCategory = (
			await db
				.insert(schema.Categories)
				.values({
					userId,
					iconId: data.iconId,
					type: data.type,
					id: uuidV4(),
					name: data.name,
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
			archived: true,
		}
		return output
	})
