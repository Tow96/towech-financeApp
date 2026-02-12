import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { Category } from '@/core/entities'
import { SetCategoryStatusSchema, mapEntityToCategoryDetail } from '@/core/contracts'

import { CategoryRepository } from '@/database/repositories'

export const setCategoryStatus = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(SetCategoryStatusSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		const categoryRepo = new CategoryRepository()

		logger.info(
			`User: ${userId} trying to set status of category: ${data.type}:${data.id}${data.subId && `:${data.subId}`}`,
		)

		const category = await categoryRepo.get(data.type, data.id, data.subId ?? null)
		if (!category || category.userId !== userId)
			throw new Response(`Category not found`, { status: 404 })

		const updatedCategory: Category = {
			...category,
			archived: data.archived,
		}
		await categoryRepo.update(updatedCategory)
		logger.info(
			`User: ${userId} set status of category: ${data.type}:${data.id}${data.subId && `:${data.subId}`} to ${updatedCategory.archived}`,
		)

		return mapEntityToCategoryDetail(updatedCategory)
	})
