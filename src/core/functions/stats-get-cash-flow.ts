import { and, eq, gte, lte, sql, sum } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'
import type { GetCashFlowStatisticItemDto } from '@/core/contracts'

import { GetCashFlowStatisticSchema } from '@/core/contracts'
import { CategoryType } from '@/core/entities'

import { db, schema } from '@/database/utils'

export const getCashFlowStatistic = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetCashFlowStatisticSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		try {
			logger.info(
				`User ${userId} requesting cash flow statistic from: ${data.periodStart.toISOString()} to: ${data.periodEnd.toISOString()}`,
			)

			const dailyMovements = db
				.select({
					date:
						data.mode === 'day'
							? schema.Movements.date
							: sql<Date>`DATE_TRUNC('month', ${schema.Movements.date} AT TIME ZONE 'America/Mexico_City')`
									.mapWith(x => new Date(x))
									.as('date'),
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
				.where(
					and(
						eq(schema.Movements.userId, userId),
						gte(schema.Movements.date, data.periodStart),
						lte(schema.Movements.date, data.periodEnd),
					),
				)
				.groupBy(
					data.mode === 'day'
						? schema.Movements.date
						: sql<Date>`DATE_TRUNC('month', ${schema.Movements.date} AT TIME ZONE 'America/Mexico_City')`,
				)
				.orderBy(
					data.mode === 'day'
						? schema.Movements.date
						: sql<Date>`DATE_TRUNC('month', ${schema.Movements.date} AT TIME ZONE 'America/Mexico_City')`,
				)
				.as('daily_movements')

			const targetDays = await db
				.select({ pate: sql<Date>`date`.mapWith(x => new Date(x)).as('pate') })
				.from(
					sql.raw(
						`(SELECT generate_series('${data.periodStart.getUTCFullYear()}-${data.periodStart.getUTCMonth() + 1}-${data.periodStart.getUTCDate()}'::date, '${data.periodEnd.getUTCFullYear()}-${data.periodEnd.getUTCMonth() + 1}-${data.periodEnd.getUTCDate()}'::date, '1 ${data.mode}'::interval)::date AS date)`,
					),
				)
				.as('target_days')

			const result = await db
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

			return result.map(x => ({
				date: x.date,
				in: x.income,
				out: -1 * x.expense,
				net: x.total,
			})) as Array<GetCashFlowStatisticItemDto>
		} catch (e) {
			logger.error(e)
			return []
		}
	})
