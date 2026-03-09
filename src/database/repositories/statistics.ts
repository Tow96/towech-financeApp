import { and, eq, gte, lte, or, sql, sum } from 'drizzle-orm'

import type {
	BalancePerWalletStatisticDto,
	BalanceStatisticTrendDto,
	CashFlowStatisticTrendLegacyItemDto,
	CashFlowTrendStatisticItemDto,
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

	public async queryGenerateCashFlowTrend(
		userId: string,
		dates: Array<Array<Date>>,
	): Promise<Array<CashFlowTrendStatisticItemDto>> {
		const targetDays = db
			.select({
				startDate: sql<Date>`startDate`.mapWith(x => new Date(x + 'Z')).as('startDate'),
				endDate: sql<Date>`endDate`.mapWith(x => new Date(x + 'Z')).as('endDate'),
			})
			.from(
				sql.raw(
					`(VALUES ${dates.map(x => `('${x[0].toISOString()}'::timestamp, '${x[1].toISOString()}'::timestamp)`).join(',')}) AS timestamps(startDate, endDate)`,
				),
			)
			.as('danger_days')

		const result = await db
			.select({
				date: targetDays.endDate,
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
			.leftJoin(
				schema.Movements,
				and(
					gte(schema.Movements.date, targetDays.startDate),
					lte(schema.Movements.date, targetDays.endDate),
					eq(schema.Movements.userId, userId),
				),
			)
			.leftJoin(schema.MovementSummary, eq(schema.Movements.id, schema.MovementSummary.movementId))
			.groupBy(targetDays.endDate)
			.orderBy(targetDays.endDate)

		return result.map(x => ({
			date: x.date,
			in: x.income,
			out: x.expense,
			net: x.total,
		}))
	}
}
