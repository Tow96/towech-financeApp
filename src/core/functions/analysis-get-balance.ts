import { eq, sql, sum } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import { CategoryType } from '@/core/entities'
import { db, schema } from '@/database'

export const getBalanceAnalysis = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.handler(async ({ context: { userId, logger } }) => {
		try {
			const from = new Date(Date.UTC(2026, 0, 4))
			const to = new Date(Date.UTC(2026, 0, 19))

			logger.info(
				`User ${userId} requesting balance chart from: ${from.toISOString()} to: ${to.toISOString()}`,
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
				.leftJoin(
					schema.MovementSummary,
					eq(schema.Movements.id, schema.MovementSummary.movementId),
				)
				.where(eq(schema.Movements.userId, userId))
				.groupBy(schema.Movements.date)
				.orderBy(schema.Movements.date)
				.as('daily_movements')

			const targetDays = db
				.select({ pate: sql<Date>`date`.mapWith(x => new Date(x)).as('pate') })
				.from(
					sql`(SELECT generate_series(${from}::date, ${to}::date, '1 day'::interval)::date AS date)`,
				)
				.as('target_days')

			const highResDailyMovements = db
				.select({
					date: sql<Date>`COALESCE(${dailyMovements.date}, ${targetDays.pate})`.as('date'),
					income: sql<number>`COALESCE(${dailyMovements.income}, 0)`.as('income'),
					expense: sql<number>`COALESCE(${dailyMovements.expense},0)`.as('expense'),
					total: sql<number>`COALESCE(${dailyMovements.total}, 0)`.as('total'),
				})
				.from(dailyMovements)
				.fullJoin(targetDays, eq(dailyMovements.date, targetDays.pate))
				.as('highResDailyMovements')

			const dailyBalance = await db
				.select({
					date: highResDailyMovements.date,
					income: sql<number>`SUM(${highResDailyMovements.income}) OVER(ORDER BY ${highResDailyMovements.date})`,
					expense: sql<number>`SUM(${highResDailyMovements.expense}) OVER(ORDER BY ${highResDailyMovements.date})`,
					total: sql<number>`SUM(${highResDailyMovements.total}) OVER(ORDER BY ${highResDailyMovements.date})`,
				})
				.from(highResDailyMovements)
				.orderBy(highResDailyMovements.date)

			logger.debug(dailyBalance)

			return [
				{ date: new Date('2026-01-18'), balance: 186 },
				{ date: new Date('2026-01-19'), balance: 305 },
				{ date: new Date('2026-01-20'), balance: 237 },
				// { date: new Date('2026-01-21'), balance: 73 },
				{ date: new Date('2026-01-22'), balance: 209 },
				{ date: new Date('2026-01-23'), balance: 214 },
				{ date: new Date('2026-01-24'), balance: 214 },
			]
		} catch (e) {
			logger.error(e)
			return e
		}
	})

