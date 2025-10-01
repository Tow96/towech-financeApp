// Decorator used to indicate if a route is public
import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_ROUTE_KEY = 'public-route';

export const Public = (): CustomDecorator<string> => SetMetadata(IS_PUBLIC_ROUTE_KEY, true);
