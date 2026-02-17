import { and, desc, eq, gte, lt, sql } from 'drizzle-orm'

import type { ListMovementItemDto } from '@/core/dto'
import type { CategoryType, Movement } from '@/core/domain'

import { db, schema } from '@/database/utils'

export class MovementRepository {
	// Commands -------------------------------------------------------
	public async delete(id: string): Promise<void> {
		await db.transaction(async tx => {
			await tx.delete(schema.MovementSummary).where(eq(schema.MovementSummary.movementId, id))
			await tx.delete(schema.Movements).where(eq(schema.Movements.id, id))
		})
	}

	public async get(id: string): Promise<Movement | null> {
		const result = await db.query.Movements.findMany({
			with: { summary: true },
			where: eq(schema.Movements.id, id),
		})
		if (result.length === 0) return null

		return {
			userId: result[0].userId,
			id: result[0].id,
			date: result[0].date,
			description: result[0].description,
			category: {
				type: result[0].categoryType as CategoryType,
				id: result[0].categoryId,
				subId: result[0].categorySubId,
			},
			amount: result[0].summary[0].amount,
			wallet: {
				originId: result[0].summary[0].originWalletId,
				destinationId: result[0].summary[0].destinationWalletId,
			},
		}
	}

	public async insert(movement: Movement): Promise<void> {
		await db.transaction(async tx => {
			await tx.insert(schema.Movements).values({
				userId: movement.userId,
				id: movement.id,
				date: movement.date,
				description: movement.description,
				categoryType: movement.category.type,
				categoryId: movement.category.id,
				categorySubId: movement.category.subId,
				createdAt: new Date(),
				updatedAt: new Date(0),
			})
			await tx.insert(schema.MovementSummary).values({
				movementId: movement.id,
				amount: movement.amount,
				originWalletId: movement.wallet.originId,
				destinationWalletId: movement.wallet.destinationId,
			})
		})
	}

	public async update(movement: Movement): Promise<void> {
		await db.transaction(async tx => {
			await tx
				.delete(schema.MovementSummary)
				.where(eq(schema.MovementSummary.movementId, movement.id))
			await tx
				.update(schema.Movements)
				.set({
					date: movement.date,
					description: movement.description,
					categoryType: movement.category.type,
					categoryId: movement.category.id,
					categorySubId: movement.category.subId,
					updatedAt: new Date(),
				})
				.where(eq(schema.Movements.id, movement.id))
			await tx.insert(schema.MovementSummary).values({
				movementId: movement.id,
				amount: movement.amount,
				originWalletId: movement.wallet.originId,
				destinationWalletId: movement.wallet.destinationId,
			})
		})
	}

	// Queries --------------------------------------------------------
	public async queryGetMovementList(
		userId: string,
		periodStart: Date,
		walletId?: string,
	): Promise<Array<ListMovementItemDto>> {
		const query = await db.query.Movements.findMany({
			with: { summary: true },
			where: and(
				eq(schema.Movements.userId, userId),
				gte(schema.Movements.date, new Date(periodStart.getFullYear(), periodStart.getMonth())),
				lt(schema.Movements.date, new Date(periodStart.getFullYear(), periodStart.getMonth() + 1)), // Primitive handles year rollover
			),
			orderBy: [desc(schema.Movements.date), desc(schema.Movements.createdAt)],
		})

		let output: Array<ListMovementItemDto> = query.map(x => ({
			id: x.id,
			date: x.date,
			description: x.description,
			amount: x.summary[0].amount,
			category: {
				type: x.categoryType as CategoryType,
				id: x.categoryId,
				subId: x.categorySubId,
			},
			wallet: {
				originId: x.summary[0].originWalletId,
				destinationId: x.summary[0].destinationWalletId,
			},
		}))

		// TODO: This filter should be moved to sql
		if (walletId)
			output = output.filter(
				x => x.wallet.originId === walletId || x.wallet.destinationId === walletId,
			)

		return output
	}

	public async queryGetRecentMovements(
		userId: string,
		count: number,
	): Promise<Array<ListMovementItemDto>> {
		const query = await db.query.Movements.findMany({
			with: { summary: true },
			where: and(eq(schema.Movements.userId, userId)),
			orderBy: sql`GREATEST(${schema.Movements.createdAt}, ${schema.Movements.updatedAt}) DESC`,
			limit: count,
		})

		const output: Array<ListMovementItemDto> = query.map(x => ({
			id: x.id,
			date: x.date,
			description: x.description,
			amount: x.summary[0].amount,
			category: {
				type: x.categoryType as CategoryType,
				id: x.categoryId,
				subId: x.categorySubId,
			},
			wallet: {
				originId: x.summary[0].originWalletId,
				destinationId: x.summary[0].destinationWalletId,
			},
		}))

		return output
	}
}

