import { createServerFn } from '@tanstack/react-start'
import { AuthorizationMiddleware } from './session-validate'

import { GetBalancePerWalletStatisticRequest } from '@/core/dto'

import { StatisticsRepository } from '@/database/repositories'

export const getBalancePerWalletStatistic = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetBalancePerWalletStatisticRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const statisticRepo = new StatisticsRepository()
		logger.info(
			`User ${userId} is requesting balance per wallet report until ${data.periodEnd.toISOString()}`,
		)

		return await statisticRepo.queryGenerateBalancePerWallet(userId, data.periodEnd)
	})
