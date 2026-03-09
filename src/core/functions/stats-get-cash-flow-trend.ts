import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { CashFlowTrendStatisticItemDto } from '@/core/dto'
import { GetCashFlowTrendStatisticRequest } from '@/core/dto'

import { StatisticsRepository } from '@/database/repositories'

export const getCashFlowStatisticTrend = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetCashFlowTrendStatisticRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const statisticsRepo = new StatisticsRepository()
		logger.info(
			`User ${userId} requesting cash flow trend statistic from: ${data.periodStart.toISOString()} to: ${data.periodEnd.toISOString()}`,
		)

		const result: Array<CashFlowTrendStatisticItemDto> = [
			{ date: new Date(2026, 1, 8), in: 5000, out: 8000, net: -3000 },
			{ date: new Date(2026, 1, 9), in: 2000, out: 3000, net: -1000 },
			{ date: new Date(2026, 1, 10), in: 9000, out: 2000, net: 7000 },
			{ date: new Date(2026, 1, 11), in: 10000, out: 0, net: 10000 },
			{ date: new Date(2026, 1, 12), in: 0, out: 0, net: 0 },
			{ date: new Date(2026, 1, 13), in: 0, out: 0, net: 0 },
			{ date: new Date(2026, 1, 14), in: 0, out: 3000, net: -3000 },
		]

		return result
	})

