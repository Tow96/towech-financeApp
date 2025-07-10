import { CommonSchema } from '../../common.schema';
import { InferResultType } from '../../primitives';

type Schema = typeof CommonSchema;

export type CategoryModel = InferResultType<Schema, 'categoriesTable', { subCategories: true }>;
export type SubCategoryModel = InferResultType<Schema, 'subCategoriesTable'>;
