import { and, eq, getTableColumns, or, sql, sum } from 'drizzle-orm'

import type { ListWalletItemDto, ListWalletsDto } from '@/core/dto'
import type { Wallet } from '@/core/domain'

import { db, schema } from '@/database/utils'

export class WalletRepository {
	private FetchMoneySql = sum(
		sql`CASE
            WHEN ${schema.MovementSummary.destinationWalletId}=${schema.Wallets.id} THEN ${schema.MovementSummary.amount}
            WHEN ${schema.MovementSummary.originWalletId}=${schema.Wallets.id} THEN -${schema.MovementSummary.amount}
            ELSE 0
          END`,
	)
		.mapWith(Number)
		.as('money')

	// Commands -------------------------------------------------------
	public async existsByName(userId: string, name: string): Promise<boolean> {
		const result = await db
			.select({ id: schema.Wallets.id })
			.from(schema.Wallets)
			.where(and(eq(schema.Wallets.userId, userId), eq(schema.Wallets.name, name)))
		return result.length > 0
	}

	public async get(id: string): Promise<Wallet | null> {
		const result = await db
			.select({
				...getTableColumns(schema.Wallets),
				money: this.FetchMoneySql,
			})
			.from(schema.Wallets)
			.leftJoin(
				schema.MovementSummary,
				or(
					eq(schema.MovementSummary.originWalletId, schema.Wallets.id),
					eq(schema.MovementSummary.destinationWalletId, schema.Wallets.id),
				),
			)
			.where(eq(schema.Wallets.id, id))
			.groupBy(schema.Wallets.id)
		if (result.length === 0) return null

		return {
			userId: result[0].userId,
			id: result[0].id,
			iconId: result[0].iconId,
			name: result[0].name,
			archived: result[0].archivedAt !== null,
			money: result[0].money,
		}
	}

	public async insert(wallet: Wallet): Promise<void> {
		await db.insert(schema.Wallets).values({
			...wallet,
			archivedAt: wallet.archived ? new Date() : null,
			createdAt: new Date(),
			updatedAt: new Date(0),
		})
	}

	public async update(wallet: Wallet): Promise<void> {
		await db
			.update(schema.Wallets)
			.set({
				...wallet,
				archivedAt: wallet.archived ? new Date() : null,
				updatedAt: new Date(),
			})
			.where(eq(schema.Wallets.id, wallet.id))
	}

	// Queries --------------------------------------------------------
	public async queryGetAllWallets(userId: string): Promise<ListWalletsDto> {
		const query = await db
			.select({
				...getTableColumns(schema.Wallets),
				money: this.FetchMoneySql,
			})
			.from(schema.Wallets)
			.leftJoin(
				schema.MovementSummary,
				or(
					eq(schema.MovementSummary.originWalletId, schema.Wallets.id),
					eq(schema.MovementSummary.destinationWalletId, schema.Wallets.id),
				),
			)
			.where(and(eq(schema.Wallets.userId, userId)))
			.groupBy(schema.Wallets.id)
			.orderBy(schema.Wallets.name)

		let total = 0
		const wallets: Array<ListWalletItemDto> = []
		for (const wallet of query) {
			total += wallet.money
			wallets.push({
				id: wallet.id,
				iconId: wallet.iconId,
				money: wallet.money,
				name: wallet.name,
				archived: wallet.archivedAt !== null,
			})
		}

		return { total, wallets }
	}
}
