import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import { GetCashFlowTrendStatisticRequest } from '@/core/dto'
import { getDaysBetweenDates } from '@/core/utils'

import { StatisticsRepository } from '@/database/repositories'

export const getCashFlowStatisticTrend = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetCashFlowTrendStatisticRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const statisticsRepo = new StatisticsRepository()
		logger.info(
			`User ${userId} requesting cash flow trend statistic from: ${data.periodStart.toISOString()} to: ${data.periodEnd.toISOString()}`,
		)

		let mode: 'day' | 'month' = 'day'
		if (getDaysBetweenDates(data.periodStart, data.periodEnd) > 90) mode = 'month'

		const startDate = new Date(data.periodStart)
		const dates: Array<Array<Date>> = []
		while (startDate.getTime() < data.periodEnd.getTime()) {
			const endDate = new Date(startDate)
			if (mode === 'month') endDate.setMonth(endDate.getMonth() + 1)
			else endDate.setDate(endDate.getDate() + 1)

			endDate.setTime(endDate.getTime() - 1)
			dates.push([new Date(startDate), endDate])

			if (mode === 'month') startDate.setMonth(startDate.getMonth() + 1)
			else startDate.setDate(startDate.getDate() + 1)
		}

		return await statisticsRepo.queryGenerateCashFlowTrend(userId, dates)
	})
