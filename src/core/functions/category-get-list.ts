import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { CategoryType } from '@/core/entities'
import type { CategoryListItemDto } from '@/core/contracts'

import { GetCategoryListSchema } from '@/core/contracts'

import { CategoryRepository } from '@/database/repositories'

export const getCategoriesByType = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetCategoryListSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		const repository = new CategoryRepository()
		logger.info(`Fetching categories of type ${data.type} for user: ${userId}`)

		const query = await repository.queryListByType(userId, data.type)

		const response: Array<CategoryListItemDto> = []
		for (const item of query) {
			let catIndex = response.findIndex(c => c.id === item.id)

			if (catIndex === -1) {
				response.push({
					iconId: item.iconId,
					type: item.type as CategoryType,
					id: item.id,
					subId: null,
					name: item.name,
					subCategories: [],
					archived: item.archived !== null,
				})
				catIndex = response.findIndex(c => c.id === item.id)
			}

			if (item.subId !== null) {
				response[catIndex].subCategories!.push({
					iconId: item.subIconId!,
					type: item.type as CategoryType,
					id: item.id,
					subId: item.subId,
					name: item.subName!,
					subCategories: null,
					archived: item.subArchived !== null,
				})
			}
		}

		return response
	})
