// Typescript gymnastics to make models that include references with drizzle

import type { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from 'drizzle-orm';

export type TSchema<T extends Record<string, unknown>> = ExtractTablesWithRelations<T>;

export type IncludeRelation<
  T extends Record<string, unknown>,
  TableName extends keyof TSchema<T>,
> = DBQueryConfig<'one' | 'many', boolean, TSchema<T>, TSchema<T>[TableName]>['with'];

export type InferResultType<
  T extends Record<string, unknown>,
  TableName extends keyof TSchema<T>,
  With extends IncludeRelation<T, TableName> | undefined = undefined,
> = BuildQueryResult<TSchema<T>, TSchema<T>[TableName], { with: With }>;
