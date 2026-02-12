import { and, eq, gte, lte, sql, sum } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import { GetBalanceStatiscticSchema } from '@/core/contracts'
import { CategoryType } from '@/core/entities'
import { db, schema } from '@/database/utils'

export const getBalanceStatistic = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetBalanceStatiscticSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		logger.info(
			`User ${userId} requesting balance chart from: ${data.periodStart.toISOString()} to: ${data.periodEnd.toISOString()}`,
		)

		const dailyMovements = await db
			.select({
				date: schema.Movements.date,
				income: sum(
					sql`CASE WHEN ${schema.Movements.categoryType}=${CategoryType.income} THEN ${schema.MovementSummary.amount} ELSE 0 END`,
				)
					.mapWith(Number)
					.as('income'),
				expense: sum(
					sql`CASE WHEN ${schema.Movements.categoryType}=${CategoryType.expense} THEN ${schema.MovementSummary.amount} ELSE 0 END`,
				)
					.mapWith(Number)
					.as('expense'),
				total: sum(
					sql`CASE
						WHEN ${schema.Movements.categoryType}=${CategoryType.income} THEN ${schema.MovementSummary.amount}
						WHEN ${schema.Movements.categoryType}=${CategoryType.expense} THEN -${schema.MovementSummary.amount}
						ELSE 0
					END`,
				)
					.mapWith(Number)
					.as('total'),
			})
			.from(schema.Movements)
			.leftJoin(schema.MovementSummary, eq(schema.Movements.id, schema.MovementSummary.movementId))
			.where(eq(schema.Movements.userId, userId))
			.groupBy(schema.Movements.date)
			.orderBy(schema.Movements.date)
			.as('daily_movements')

		const targetDays = await db
			.select({ pate: sql<Date>`date`.mapWith(x => new Date(x)).as('pate') })
			.from(
				sql.raw(
					`(SELECT generate_series('${data.periodStart.getUTCFullYear()}-${data.periodStart.getUTCMonth() + 1}-${data.periodStart.getUTCDate()}'::date, '${data.periodEnd.getUTCFullYear()}-${data.periodEnd.getUTCMonth() + 1}-${data.periodEnd.getUTCDate()}'::date, '1 day'::interval)::date AS date)`,
				),
			)
			.as('target_days')

		const highResDailyMovements = db
			.select({
				date: sql<Date>`COALESCE(${dailyMovements.date}, ${targetDays.pate})`
					.mapWith(x => new Date(x))
					.as('date'),
				income: sql<number>`COALESCE(${dailyMovements.income}, 0)`.as('income'),
				expense: sql<number>`COALESCE(${dailyMovements.expense},0)`.as('expense'),
				total: sql<number>`COALESCE(${dailyMovements.total}, 0)`.as('total'),
			})
			.from(dailyMovements)
			.fullJoin(targetDays, eq(dailyMovements.date, targetDays.pate))
			.as('highResDailyMovements')

		const dailyBalance = db
			.select({
				date: highResDailyMovements.date,
				income:
					sql<number>`SUM(${highResDailyMovements.income}) OVER(ORDER BY ${highResDailyMovements.date})`.as(
						'income',
					),
				expense:
					sql<number>`SUM(${highResDailyMovements.expense}) OVER(ORDER BY ${highResDailyMovements.date})`.as(
						'expense',
					),
				total:
					sql<number>`SUM(${highResDailyMovements.total}) OVER(ORDER BY ${highResDailyMovements.date})`.as(
						'total',
					),
			})
			.from(highResDailyMovements)
			.orderBy(highResDailyMovements.date)
			.as('dailyBalance')

		const result = await db
			.select()
			.from(dailyBalance)
			.where(and(gte(dailyBalance.date, data.periodStart), lte(dailyBalance.date, data.periodEnd)))

		return result.map(x => ({
			date: x.date,
			balance: x.total,
			totalIncome: x.income,
			totalExpense: x.expense,
		}))
	})
