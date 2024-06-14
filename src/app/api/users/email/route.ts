import { isAuthenticated } from '@/libs/feature-authentication';
import { apiHandler } from '@/utils';

export const POST = apiHandler(isAuthenticated, async _ => {});
