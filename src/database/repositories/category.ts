import { and, eq, getTableColumns } from 'drizzle-orm'

import type { CategoryListItemDto } from '@/core/dto'
import type { Category, CategoryType } from '@/core/domain'

import { db, schema } from '@/database/utils'

export class CategoryRepository {
	// Commands -------------------------------------------------------
	public async existsByName(
		userId: string,
		type: CategoryType,
		id: string | null,
		name: string,
	): Promise<boolean> {
		// Main category ----------------------------
		if (id === null) {
			const result = await db
				.select({ id: schema.Categories.id })
				.from(schema.Categories)
				.where(
					and(
						eq(schema.Categories.userId, userId),
						eq(schema.Categories.type, type),
						eq(schema.Categories.name, name),
					),
				)

			return result.length > 0
		}

		// Subcategory ------------------------------
		const result = await db
			.select({ id: schema.SubCategories.id })
			.from(schema.SubCategories)
			.where(and(eq(schema.SubCategories.parentId, id), eq(schema.SubCategories.name, name)))

		return result.length > 0
	}

	public async get(type: CategoryType, id: string, subId: string | null): Promise<Category | null> {
		if (subId === null) {
			const result = await db
				.select()
				.from(schema.Categories)
				.where(and(eq(schema.Categories.type, type), eq(schema.Categories.id, id)))
			if (result.length === 0) return null
			return {
				archived: result[0].archivedAt !== null,
				iconId: result[0].iconId,
				id: result[0].id,
				name: result[0].name,
				subId: null,
				type: result[0].type as CategoryType,
				userId: result[0].userId,
			}
		}

		const result = await db
			.select({
				...getTableColumns(schema.SubCategories),
				type: schema.Categories.type,
				userId: schema.Categories.userId,
				parentId: schema.Categories.id,
			})
			.from(schema.SubCategories)
			.leftJoin(schema.Categories, eq(schema.SubCategories.parentId, schema.Categories.id))
			.where(and(eq(schema.SubCategories.parentId, id), eq(schema.SubCategories.id, subId)))
		if (result.length === 0) return null

		return {
			archived: result[0].archivedAt !== null,
			iconId: result[0].iconId,
			id: result[0].parentId!,
			name: result[0].name,
			subId: result[0].id,
			type: result[0].type as CategoryType,
			userId: result[0].userId!,
		}
	}

	public async insert(category: Category) {
		// Main category
		if (!category.subId) {
			await db.insert(schema.Categories).values({
				...category,
				createdAt: new Date(),
				updatedAt: new Date(0),
				archivedAt: category.archived ? new Date() : null,
			})

			return
		}

		// Sub category
		await db.insert(schema.SubCategories).values({
			parentId: category.id,
			id: category.subId,
			iconId: category.iconId,
			name: category.name,
			archivedAt: category.archived ? new Date() : null,
			createdAt: new Date(),
			updatedAt: new Date(0),
		})
	}

	public async update(category: Category) {
		// Main category
		if (!category.subId) {
			await db
				.update(schema.Categories)
				.set({
					...category,
					archivedAt: category.archived ? new Date() : null,
					updatedAt: new Date(),
				})
				.where(
					and(eq(schema.Categories.type, category.type), eq(schema.Categories.id, category.id)),
				)
			return
		}

		// Sub category
		await db
			.update(schema.SubCategories)
			.set({
				parentId: category.id,
				id: category.subId,
				iconId: category.iconId,
				name: category.name,
				archivedAt: category.archived ? new Date() : null,
				updatedAt: new Date(),
			})
			.where(
				and(
					eq(schema.SubCategories.parentId, category.id),
					eq(schema.SubCategories.id, category.subId),
				),
			)
	}
	// Queries --------------------------------------------------------
	public async queryListByType(userId: string, type: string): Promise<Array<CategoryListItemDto>> {
		const result = await db
			.select({
				iconId: schema.Categories.iconId,
				subIconId: schema.SubCategories.iconId,
				type: schema.Categories.type,
				id: schema.Categories.id,
				subId: schema.SubCategories.id,
				name: schema.Categories.name,
				subName: schema.SubCategories.name,
				archived: schema.Categories.archivedAt,
				subArchived: schema.SubCategories.archivedAt,
			})
			.from(schema.Categories)
			.leftJoin(schema.SubCategories, eq(schema.Categories.id, schema.SubCategories.parentId))
			.where(and(eq(schema.Categories.userId, userId), eq(schema.Categories.type, type)))
			.orderBy(schema.Categories.name)

		const output: Array<CategoryListItemDto> = []
		for (const item of result) {
			let catIndex = output.findIndex(c => c.id === item.id)

			if (catIndex === -1) {
				output.push({
					iconId: item.iconId,
					type: item.type as CategoryType,
					id: item.id,
					subId: null,
					name: item.name,
					subCategories: [],
					archived: item.archived !== null,
				})
				catIndex = output.findIndex(c => c.id === item.id)
			}

			if (item.subId !== null) {
				output[catIndex].subCategories!.push({
					iconId: item.subIconId!,
					type: item.type as CategoryType,
					id: item.id,
					subId: item.subId,
					name: item.subName!,
					subCategories: null,
					archived: item.subArchived !== null,
				})
			}
		}

		return output
	}
}

