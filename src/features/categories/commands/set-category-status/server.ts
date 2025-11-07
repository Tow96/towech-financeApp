import { eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { SetCategoryStatusSchema } from './dto'
import type { CategoryType } from '@/features/categories/domain'
import type { CategoryDetailDto } from '@/features/categories/queries/detail-category/dto'

import { db, schema } from '@/integrations/drizzle-db'
import { AuthorizationMiddleware } from '@/integrations/clerk'

export const setCategoryStatus = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(SetCategoryStatusSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		const categories = await db
			.select()
			.from(schema.Categories)
			.where(eq(schema.Categories.id, data.id))

		if (categories.length === 0) throw new Response('Category not found', { status: 404 })
		if (categories[0].userId !== userId) throw new Response('Unauthorized', { status: 403 })

		logger.info(`User: ${userId} setting status for category: ${data.id}`)
		const updatedCategory = (
			await db
				.update(schema.Categories)
				.set({ archivedAt: data.archived ? new Date() : null })
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
	})
