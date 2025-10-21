import { integer, pgSchema, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const MainSchema = pgSchema('main')

export const Categories = MainSchema.table('categories', {
	id: uuid('id').defaultRandom().primaryKey(),
	type: varchar('type').notNull(),
	userId: varchar('user_id').notNull(),
	iconId: integer('icon_id').notNull(),
	name: varchar('name').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
	archivedAt: timestamp('archived_at', { withTimezone: true }),
})

export const SubCategories = MainSchema.table('sub-categories', {
	id: uuid('id').defaultRandom().primaryKey(),
	parentId: uuid('parent_id')
		.references(() => Categories.id)
		.notNull(),
	iconId: integer('icon_id').notNull(),
	name: varchar('name').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
	archivedAt: timestamp('archived_at', { withTimezone: true }),
});

export const categoryRelations = relations(Categories, ({ many }) => ({
	subCategories: many(SubCategories),
}));

export const subCategoryRelations = relations(SubCategories, ({ one }) => ({
	parent: one(Categories, {
		fields: [SubCategories.parentId],
		references: [Categories.id],
	}),
}));

export const Wallets = MainSchema.table('wallets', {
	id: uuid('id').defaultRandom().primaryKey(),
	iconId: integer('icon_id').notNull(),
	userId: varchar('user_id').notNull(),
	name: varchar('name').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
	archivedAt: timestamp('archived_at', { withTimezone: true }),
});

export const Movements = MainSchema.table('movements', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: varchar('user_id').notNull(),
	categoryType: varchar('category_type').notNull(),
	categoryId: uuid('category_id'),
	categorySubId: uuid('category_sub_id'),
	description: varchar('description').notNull(),
	date: timestamp('date', { withTimezone: true }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export const MovementSummary = MainSchema.table('movement_summary', {
	id: uuid('id').defaultRandom().primaryKey(),
	movementId: uuid('movement_id')
		.references(() => Movements.id)
		.notNull(),
	originWalletId: uuid('origin_wallet_id'),
	destinationWalletId: uuid('destination_wallet_id'),
	amount: integer('amount').notNull(),
});

export const movementRelations = relations(Movements, ({ many }) => ({
	summary: many(MovementSummary),
}));

export const movementSummaryRelations = relations(MovementSummary, ({ one }) => ({
	parent: one(Movements, {
		fields: [MovementSummary.movementId],
		references: [Movements.id],
	}),
}));

export const Budgets = MainSchema.table('budgets', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: varchar('user_id').notNull(),
	year: integer('year').notNull(),
	name: varchar('name').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export const BudgetSummary = MainSchema.table('budget_summary', {
	id: uuid().defaultRandom().primaryKey(),
	budgetId: uuid('budget_id')
		.references(() => Budgets.id)
		.notNull(),
	month: integer('month').notNull(),
	categoryType: varchar('category_type').notNull(),
	categoryId: uuid('category_id'),
	categorySubId: uuid('category_sub_id'),
	limit: integer('limit').notNull(),
});

export const budgetRelations = relations(Budgets, ({ many }) => ({
	summary: many(BudgetSummary),
}));

export const budgetSummaryRelations = relations(BudgetSummary, ({ one }) => ({
	parent: one(Budgets, {
		fields: [BudgetSummary.budgetId],
		references: [Budgets.id],
	}),
}));
