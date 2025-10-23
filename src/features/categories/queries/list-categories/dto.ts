import { z } from 'zod';

export type CategoryListItemDto = {
	iconId: number;
	type: CategoryType;
	id: string;
	name: string;
	subCategories: Array<SubCategoryListItemDto>;
	archived: boolean;
}

export type SubCategoryListItemDto = {
	iconId: number;
	id: string;
	name: string;
	archived: boolean;
}

export enum CategoryType {
	income = 'INCOME',
	expense = 'EXPENSE',
	transfer = 'TRANSFER',
}

export const GetCategoryListSchema = z.object({
	type: z.enum(CategoryType),
})
