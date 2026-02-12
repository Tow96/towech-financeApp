import { and, eq } from 'drizzle-orm'

import { db, schema } from '@/database/utils'

export class CategoryRepository {
	// Commands -------------------------------------------------------
	public async categoryExistsByName(userId: string, name: string, type: string): Promise<boolean> {
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

	public async getCategory(id: string) {
		const result = await db.select().from(schema.Categories).where(eq(schema.Categories.id, id))

		return result.length > 0 ? result[0] : null
	}

	public async getSubCategory(parentId: string, id: string) {
		const result = await db
			.select()
			.from(schema.SubCategories)
			.where(and(eq(schema.SubCategories.parentId, parentId), eq(schema.SubCategories.id, id)))

		return result.length > 0 ? result[0] : null
	}

	public async insertCategory(
		userId: string,
		type: string,
		id: string,
		name: string,
		iconId: number,
	) {
		const result = await db
			.insert(schema.Categories)
			.values({
				userId,
				type,
				id,
				name,
				iconId,
				createdAt: new Date(),
				updatedAt: new Date(0),
			})
			.returning()

		return result[0]
	}

	public async insertSubCategory(parentId: string, id: string, name: string, iconId: number) {
		const result = await db
			.insert(schema.SubCategories)
			.values({
				parentId,
				id,
				name,
				iconId,
				createdAt: new Date(),
				updatedAt: new Date(0),
			})
			.returning()

		return result[0]
	}

	public async subCategoryExistsByName(parentId: string, name: string): Promise<boolean> {
		const result = await db
			.select({ id: schema.SubCategories.id })
			.from(schema.SubCategories)
			.where(and(eq(schema.SubCategories.parentId, parentId), eq(schema.SubCategories.name, name)))

		return result.length > 0
	}

	public async setCategoryArchive(id: string, archiveStatus: boolean) {
		const result = await db
			.update(schema.Categories)
			.set({ updatedAt: new Date(), archivedAt: archiveStatus ? new Date() : null })
			.where(eq(schema.Categories.id, id))
			.returning()

		return result[0]
	}

	public async setSubCategoryArchive(parentId: string, id: string, archiveStatus: boolean) {
		const result = await db
			.update(schema.SubCategories)
			.set({ updatedAt: new Date(), archivedAt: archiveStatus ? new Date() : null })
			.where(and(eq(schema.SubCategories.parentId, parentId), eq(schema.SubCategories.id, id)))
			.returning()

		return result[0]
	}

	public async updateCategory(id: string, name: string, iconId: number) {
		const result = await db
			.update(schema.Categories)
			.set({ name, iconId, updatedAt: new Date() })
			.where(eq(schema.Categories.id, id))
			.returning()

		return result[0]
	}

	public async updateSubCategory(parentId: string, id: string, name: string, iconId: number) {
		const result = await db
			.update(schema.SubCategories)
			.set({ name, iconId, updatedAt: new Date() })
			.where(and(eq(schema.SubCategories.parentId, parentId), eq(schema.SubCategories.id, id)))
			.returning()

		return result[0]
	}

	// Queries --------------------------------------------------------
	public async queryListByType(userId: string, type: string) {
		return await db
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
	}
}

