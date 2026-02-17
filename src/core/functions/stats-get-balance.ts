import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import { GetBalanceStatiscticRequest } from '@/core/dto'

import { StatisticsRepository } from '@/database/repositories'

export const getBalanceStatistic = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetBalanceStatiscticRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const statisticRepo = new StatisticsRepository()
		logger.info(
			`User ${userId} requesting balance chart from: ${data.periodStart.toISOString()} to: ${data.periodEnd.toISOString()}`,
		)

		return await statisticRepo.queryGenerateBalance(userId, data.periodStart, data.periodEnd)
	})
