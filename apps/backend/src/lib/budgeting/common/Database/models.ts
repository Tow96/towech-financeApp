import { BudgetingSchema } from './budgeting.schema';
import { InferResultType } from '../../../_common/primitives/infer-result-type';

type Schema = typeof BudgetingSchema;

export type CategoryModel = InferResultType<Schema, 'categoriesTable', { subCategories: true }>;
export type SubCategoryModel = InferResultType<Schema, 'subCategoriesTable'>;
