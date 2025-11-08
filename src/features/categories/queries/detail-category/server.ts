import { and, eq } from 'drizzle-orm'
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
		logger.info(`User ${userId} requesting detail for category ${data.id}.${data.subId}`)

		const categories = await db
			.select()
			.from(schema.Categories)
			.where(eq(schema.Categories.id, data.id))

		if (categories.length === 0) throw new Response('Category not found', { status: 404 })
		if (categories[0].userId !== userId) throw new Response('Unauthorized', { status: 403 })

		let output: CategoryDetailDto = {
			iconId: categories[0].iconId,
			type: categories[0].type as CategoryType,
			id: categories[0].id,
			subId: null,
			name: categories[0].name,
			archived: categories[0].archivedAt !== null,
		}
		if (!data.subId) return output

		const subCategories = await db
			.select()
			.from(schema.SubCategories)
			.where(
				and(eq(schema.SubCategories.parentId, data.id), eq(schema.SubCategories.id, data.subId)),
			)
		if (subCategories.length === 0) throw new Response('Subcategory not found', { status: 404 })

		output = {
			iconId: subCategories[0].iconId,
			type: categories[0].type as CategoryType,
			id: subCategories[0].parentId,
			subId: subCategories[0].id,
			name: subCategories[0].name,
			archived: subCategories[0].archivedAt !== null,
		}

		return output
	})
