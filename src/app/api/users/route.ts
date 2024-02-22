/** route.ts
 * Copyright (c) 2024, Towechlabs
 *
 * Handlers for the users route
 */
// Libraries ------------------------------------------------------------------
import { isSuperUserOrAdmin } from '@/libs/feature-authentication';
import { apiHandler } from '@/utils';

export const POST = apiHandler(isSuperUserOrAdmin);
