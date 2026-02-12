import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { Category } from '@/core/domain'

import { EditCategoryRequest, mapEntityToCategoryDetail } from '@/core/dto'

import { CategoryRepository } from '@/database/repositories'

export const editCategory = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(EditCategoryRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const categoryRepo = new CategoryRepository()

		logger.info(
			`User: ${userId} trying to edit category: ${data.type}:${data.id}${data.subId && `:${data.subId}`}`,
		)
		const category = await categoryRepo.get(data.type, data.id, data.subId ?? null)
		if (!category || category.userId !== userId)
			throw new Response(`Category not found`, { status: 404 })

		if (data.name && (await categoryRepo.existsByName(userId, data.type, data.id, data.name)))
			throw new Response(
				`Name ${data.name} already registered under parent ${data.type}${data.id && `:${data.id}`}`,
				{ status: 409 },
			)

		const updatedCategory: Category = {
			...category,
			name: data.name ?? category.name,
			iconId: data.iconId ?? category.iconId,
		}
		await categoryRepo.update(updatedCategory)
		logger.info(
			`User: ${userId} updated category: ${data.type}:${data.id}${data.subId && `:${data.subId}`}`,
		)

		return mapEntityToCategoryDetail(updatedCategory)
	})
