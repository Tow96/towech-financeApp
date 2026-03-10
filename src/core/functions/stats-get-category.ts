import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import { GetCategoryStatisticRequest } from '@/core/dto'

import { StatisticsRepository } from '@/database/repositories'

export const getCategoryStatistic = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetCategoryStatisticRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const statisticRepo = new StatisticsRepository()
		logger.info(
			`User ${userId} requesting category report from: ${data.periodStart.toISOString()} to ${data.periodEnd.toISOString()}`,
		)

		return statisticRepo.queryGenerateCategoryReport(userId, data.periodStart, data.periodEnd)
	})
