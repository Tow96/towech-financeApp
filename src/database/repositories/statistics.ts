import { and, eq, gte, lte, sql, sum } from 'drizzle-orm'

import type { BalanceStatisicItemDto, CashFlowStatisticItemDto } from '@/core/dto'

import { CategoryType } from '@/core/domain'

import { db, schema } from '@/database/utils'

export class StatisticsRepository {
	// Queries --------------------------------------------------------
	public async queryGenerateBalance(
		userId: string,
		periodStart: Date,
		periodEnd: Date,
	): Promise<Array<BalanceStatisicItemDto>> {
		const dailyMovements = db
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

		const targetDays = db
			.select({ pate: sql<Date>`date`.mapWith(x => new Date(x)).as('pate') })
			.from(
				sql.raw(
					`(SELECT generate_series('${periodStart.getUTCFullYear()}-${periodStart.getUTCMonth() + 1}-${periodStart.getUTCDate()}'::date, '${periodEnd.getUTCFullYear()}-${periodEnd.getUTCMonth() + 1}-${periodEnd.getUTCDate()}'::date, '1 day'::interval)::date AS date)`,
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
			.where(and(gte(dailyBalance.date, periodStart), lte(dailyBalance.date, periodEnd)))

		return result.map(x => ({
			date: x.date,
			balance: x.total,
			totalIncome: x.income,
			totalExpense: x.expense,
		}))
	}

	public async queryGenerateCashFlow(
		userId: string,
		mode: 'day' | 'month',
		periodStart: Date,
		periodEnd: Date,
	): Promise<Array<CashFlowStatisticItemDto>> {
		const dailyMovements = db
			.select({
				date:
					mode === 'day'
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
			.leftJoin(schema.MovementSummary, eq(schema.Movements.id, schema.MovementSummary.movementId))
			.where(
				and(
					eq(schema.Movements.userId, userId),
					gte(schema.Movements.date, periodStart),
					lte(schema.Movements.date, periodEnd),
				),
			)
			.groupBy(
				mode === 'day'
					? schema.Movements.date
					: sql<Date>`DATE_TRUNC('month', ${schema.Movements.date} AT TIME ZONE 'America/Mexico_City')`,
			)
			.orderBy(
				mode === 'day'
					? schema.Movements.date
					: sql<Date>`DATE_TRUNC('month', ${schema.Movements.date} AT TIME ZONE 'America/Mexico_City')`,
			)
			.as('daily_movements')

		const targetDays = await db
			.select({ pate: sql<Date>`date`.mapWith(x => new Date(x)).as('pate') })
			.from(
				sql.raw(
					`(SELECT generate_series('${periodStart.getUTCFullYear()}-${periodStart.getUTCMonth() + 1}-${periodStart.getUTCDate()}'::date, '${periodEnd.getUTCFullYear()}-${periodEnd.getUTCMonth() + 1}-${periodEnd.getUTCDate()}'::date, '1 ${mode}'::interval)::date AS date)`,
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
		}))
	}
}

