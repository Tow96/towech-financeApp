import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import { GetCategoryListRequest } from '@/core/dto'

import { CategoryRepository } from '@/database/repositories'

export const getCategoriesByType = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetCategoryListRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const repository = new CategoryRepository()
		logger.info(`Fetching categories of type ${data.type} for user: ${userId}`)

		return await repository.queryListByType(userId, data.type)
	})
