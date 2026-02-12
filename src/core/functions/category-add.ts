import { v4 as uuidV4 } from 'uuid'
import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { Category } from '@/core/domain'
import { AddCategoryRequest, mapEntityToCategoryDetail } from '@/core/dto'

import { CategoryRepository } from '@/database/repositories'

export const addCategory = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(AddCategoryRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const categoryRepo = new CategoryRepository()

		logger.info(
			`User: ${userId} trying to add category ${data.type}${data.id && `:${data.id}`}_${data.name}`,
		)

		if (data.id && !(await categoryRepo.get(data.type, data.id, null)))
			throw new Response(`Category: ${data.type}:${data.id} not found`, { status: 404 })

		if (await categoryRepo.existsByName(userId, data.type, data.id ?? null, data.name))
			throw new Response(
				`Name ${data.name} already registered under parent ${data.type}${data.id && `:${data.id}`}`,
				{ status: 409 },
			)

		const newCategory: Category = {
			userId: userId,
			type: data.type,
			id: data.id ?? uuidV4(),
			subId: data.id ? uuidV4() : null,
			iconId: data.iconId,
			name: data.name,
			archived: false,
		}
		await categoryRepo.insert(newCategory)
		logger.info(
			`User: ${userId} created category: ${newCategory.type}:${newCategory.id}${newCategory.subId && `:${newCategory.subId}`}`,
		)

		return mapEntityToCategoryDetail(newCategory)
	})
