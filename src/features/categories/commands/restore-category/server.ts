import { eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { RestoreCategorySchema } from './dto'
import type { CategoryDetailDto } from '@/features/categories/domain.ts'

import { db, schema } from '@/integrations/drizzle-db'
import { AuthorizationMiddleware } from '@/integrations/clerk'

export const restoreCategory = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(RestoreCategorySchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		const categories = await db
			.select()
			.from(schema.Categories)
			.where(eq(schema.Categories.id, data.id))

		if (categories.length === 0) throw new Response('Category not found', { status: 409 })
		if (categories[0].userId !== userId) throw new Response('Unauthorized', { status: 403 })

		logger.info(`User: ${userId} restoring category ${data.id}`)
		const updatedCategory = (
			await db
				.update(schema.Categories)
				.set({ archivedAt: null })
				.where(eq(schema.Categories.id, data.id))
				.returning()
		)[0]

		return {
			iconId: updatedCategory.iconId,
			type: updatedCategory.type,
			id: updatedCategory.id,
			subId: null,
			name: updatedCategory.name,
			archived: true,
		} as CategoryDetailDto
	})
