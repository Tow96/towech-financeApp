import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import { GetCashFlowStatisticTrendLegacyRequest } from '@/core/dto'

import { StatisticsRepository } from '@/database/repositories'

export const getCashFlowStatistic = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetCashFlowStatisticTrendLegacyRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const statisticsRepo = new StatisticsRepository()
		logger.info(
			`User ${userId} requesting cash flow statistic from: ${data.periodStart.toISOString()} to: ${data.periodEnd.toISOString()}`,
		)

		return await statisticsRepo.queryGenerateCashFlow(
			userId,
			data.mode,
			data.periodStart,
			data.periodEnd,
		)
	})
