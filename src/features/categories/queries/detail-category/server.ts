import { eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { GetCategoryDetailSchema } from './dto'
import type { CategoryDetailDto } from './dto'
import type { CategoryType } from '@/features/categories/domain'

import { AuthorizationMiddleware } from '@/integrations/clerk/authorization.middleware'
import { db, schema } from '@/integrations/drizzle-db'

export const getCategoryDetail = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetCategoryDetailSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		logger.info(`User ${userId} requesting detail for category ${data.id}`)

		const categories = await db
			.select()
			.from(schema.Categories)
			.where(eq(schema.Categories.id, data.id))

		if (categories.length === 0) throw new Response('Category not found', { status: 404 })
		if (categories[0].userId !== userId) throw new Response('Unauthorized', { status: 403 })

		const output: CategoryDetailDto = {
			iconId: categories[0].iconId,
			type: categories[0].type as CategoryType,
			id: categories[0].id,
			subId: null,
			name: categories[0].name,
			archived: true,
		}
		return output
	})
