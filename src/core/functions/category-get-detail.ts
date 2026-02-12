import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import { GetCategoryDetailSchema, mapEntityToCategoryDetail } from '@/core/contracts'

import { CategoryRepository } from '@/database/repositories'

export const getCategoryDetail = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetCategoryDetailSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		const categoryRepo = new CategoryRepository()
		logger.info(
			`User ${userId} requesting detail for category ${data.type}:${data.id}${data.subId && `:${data.subId}`}`,
		)

		const category = await categoryRepo.get(data.type, data.id, data.subId ?? null)
		if (!category || category.userId !== userId)
			throw new Response('Category not found', { status: 404 })

		return mapEntityToCategoryDetail(category)
	})
