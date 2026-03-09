import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import { GetBalanceStatiscticTrendRequest } from '@/core/dto'

import { StatisticsRepository } from '@/database/repositories'

export const getBalanceStatistic = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetBalanceStatiscticTrendRequest)
	.handler(async ({ data, context: { userId, logger } }) => {
		const statisticRepo = new StatisticsRepository()
		logger.info(
			`User ${userId} requesting balance chart from: ${data.periodStart.toISOString()} to: ${data.periodEnd.toISOString()}`,
		)

		let mode: 'day' | 'month' = 'day'
		if (getDaysBetweenDates(data.periodStart, data.periodEnd) > 365) mode = 'month'

		const startDate = new Date(data.periodStart)
		const dates: Array<Date> = []
		while (startDate.getTime() < data.periodEnd.getTime()) {
			dates.push(new Date(startDate))

			if (mode === 'month') startDate.setMonth(startDate.getMonth() + 1)
			else startDate.setDate(startDate.getDate() + 1)
		}
		dates.push(data.periodEnd)

		return await statisticRepo.queryGenerateBalanceTrend(userId, dates)
	})

const getDaysBetweenDates = (date1: Date, date2: Date) => {
	const delta = Math.abs(date2.getTime() - date1.getTime())
	return Math.floor(delta / (1000 * 60 * 60 * 24))
}
