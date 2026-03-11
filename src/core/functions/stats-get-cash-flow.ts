import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { CashFlowStatisticDto } from '@/core/dto'

import { GetCashFlowStatisticRequest } from '@/core/dto'
import { getDaysBetweenDates } from '@/core/utils'

import { StatisticsRepository } from '@/database/repositories'

export const getCashFlowStatistic = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetCashFlowStatisticRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const statisticsRepo = new StatisticsRepository()
		logger.info(
			`User ${userId} requesting cash flow statistic from: ${data.periodStart.toISOString()} to ${data.periodEnd.toISOString()}`,
		)

		// We just need the data from two periods, the given and the previous
		const days = getDaysBetweenDates(data.periodStart, data.periodEnd)
		const previousPeriodStart = new Date(data.periodStart.getTime() - days * 24 * 60 * 60 * 1000)
		const previousPeriodEnd = new Date(data.periodStart.getTime() - 1)
		const dates = [
			[previousPeriodStart, previousPeriodEnd],
			[data.periodStart, data.periodEnd],
		]

		const res = await statisticsRepo.queryGenerateCashFlowTrend(userId, dates)

		const output: CashFlowStatisticDto = {
			previousPeriodEnd: res[0].net,
			in: res[1].in,
			out: res[1].out,
			net: res[1].net,
		}
		return output
	})
