import { and, eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { GetCategoryListSchema } from './dto'
import type { CategoryListItemDto } from './dto'
import type { CategoryType } from '@/features/categories/domain'

import { AuthorizationMiddleware } from '@/integrations/clerk/authorization.middleware'
import { db, schema } from '@/integrations/drizzle-db'

export const getCategoriesByType = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetCategoryListSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		logger.info(`Fetching categories of type ${data.type} for user: ${userId}`)

		const query = await db
			.select({
				iconId: schema.Categories.iconId,
				subIconId: schema.SubCategories.iconId,
				type: schema.Categories.type,
				id: schema.Categories.id,
				subId: schema.SubCategories.id,
				name: schema.Categories.name,
				subName: schema.SubCategories.name,
				archived: schema.Categories.archivedAt,
				subArchived: schema.SubCategories.archivedAt,
			})
			.from(schema.Categories)
			.leftJoin(schema.SubCategories, eq(schema.Categories.id, schema.SubCategories.parentId))
			.where(and(eq(schema.Categories.userId, userId), eq(schema.Categories.type, data.type)))
			.orderBy(schema.Categories.name)

		const response: Array<CategoryListItemDto> = []
		for (const item of query) {
			let catIndex = response.findIndex(c => c.id === item.id)

			if (catIndex === -1) {
				response.push({
					iconId: item.iconId,
					type: item.type as CategoryType,
					id: item.id,
					name: item.name,
					subCategories: [],
					archived: item.archived !== null,
				})
				catIndex = response.findIndex(c => c.id === item.id)
			}

			if (item.subId !== null) {
				response[catIndex].subCategories.push({
					iconId: item.subIconId!,
					id: item.subId,
					name: item.subName!,
					archived: item.subArchived !== null,
				})
			}
		}

		return response
	})
