import { and, eq, gte, lte, or, sql, sum } from 'drizzle-orm'

import type {
	BalancePerWalletStatisticDto,
	BalanceStatisticTrendDto,
	CashFlowStatisticTrendLegacyItemDto,
} from '@/core/dto'

import { CategoryType } from '@/core/domain'

import { db, schema } from '@/database/utils'

export class StatisticsRepository {
	// Queries --------------------------------------------------------
	public async queryGenerateBalanceTrend(
		userId: string,
		dates: Array<Date>,
	): Promise<BalanceStatisticTrendDto> {
		const previousPeriodEnd = new Date(dates[0])
		previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1)

		const queryDates = [previousPeriodEnd, ...dates]

		const targetDays = db
			.select({ pate: sql<Date>`date`.mapWith(x => new Date(x + 'Z')).as('pate') })
			.from(
				sql.raw(
					`(VALUES ${queryDates.map(x => `('${x.toISOString()}'::timestamp)`).join(',')}) AS timestamps(date)`,
				),
			)
			.as('danger_days')

		const result = await db
			.select({
				date: targetDays.pate,
				income: sum(
					sql`CASE WHEN ${schema.Movements.categoryType}=${CategoryType.income} THEN ${schema.MovementSummary.amount} ELSE 0 END`,
				).mapWith(Number),
				expense: sum(
					sql`CASE WHEN ${schema.Movements.categoryType}=${CategoryType.expense} THEN ${schema.MovementSummary.amount} ELSE 0 END`,
				).mapWith(Number),
				total: sum(
					sql`CASE
							WHEN ${schema.Movements.categoryType}=${CategoryType.income} THEN ${schema.MovementSummary.amount}
							WHEN ${schema.Movements.categoryType}=${CategoryType.expense} THEN -${schema.MovementSummary.amount}
							ELSE 0
						END`,
				).mapWith(Number),
			})
			.from(targetDays)
			.leftJoin(schema.Movements, lte(schema.Movements.date, targetDays.pate))
			.leftJoin(schema.MovementSummary, eq(schema.Movements.id, schema.MovementSummary.movementId))
			.where(eq(schema.Movements.userId, userId))
			.groupBy(targetDays.pate)
			.orderBy(targetDays.pate)

		return {
			previousPeriodEnd: {
				date: result[0].date,
				balance: result[0].total,
				totalIncome: result[0].income,
				totalExpense: result[0].expense,
			},
			items: result.slice(1).map(x => ({
				date: x.date,
				balance: x.total,
				totalIncome: x.income,
				totalExpense: x.expense,
			})),
		}
	}

	public async queryGenerateBalancePerWallet(
		userId: string,
		periodEnd: Date,
	): Promise<Array<BalancePerWalletStatisticDto>> {
		const result = await db
			.select({
				walletId: schema.Wallets.id,
				income: sum(
					sql`CASE WHEN ${schema.MovementSummary.destinationWalletId} = ${schema.Wallets.id} THEN ${schema.MovementSummary.amount} ELSE 0 END`,
				).mapWith(Number),
				expense: sum(
					sql`CASE WHEN ${schema.MovementSummary.originWalletId} = ${schema.Wallets.id} THEN ${schema.MovementSummary.amount} ELSE 0 END`,
				).mapWith(Number),
				total: sum(
					sql`CASE
						WHEN ${schema.MovementSummary.destinationWalletId} = ${schema.Wallets.id} THEN ${schema.MovementSummary.amount}
						WHEN ${schema.MovementSummary.originWalletId} = ${schema.Wallets.id} THEN -${schema.MovementSummary.amount}
						ELSE 0
					END`,
				).mapWith(Number),
			})
			.from(schema.Wallets)
			.leftJoin(
				schema.MovementSummary,
				or(
					eq(schema.Wallets.id, schema.MovementSummary.destinationWalletId),
					eq(schema.Wallets.id, schema.MovementSummary.originWalletId),
				),
			)
			.leftJoin(schema.Movements, eq(schema.MovementSummary.movementId, schema.Movements.id))
			.where(and(eq(schema.Wallets.userId, userId), lte(schema.Movements.date, periodEnd)))
			.groupBy(schema.Wallets.id)

		return result.map(x => ({
			walletId: x.walletId,
			income: x.income,
			expense: x.expense,
			total: x.total,
		}))
	}

	public async queryGenerateCashFlow(
		userId: string,
		mode: 'day' | 'month',
		periodStart: Date,
		periodEnd: Date,
	): Promise<Array<CashFlowStatisticTrendLegacyItemDto>> {
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
