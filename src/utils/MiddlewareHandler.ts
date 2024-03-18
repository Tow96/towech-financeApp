/** middlewareHandler.ts
 * https://medium.com/sopra-steria-norge/how-to-write-actual-api-middleware-for-next-js-2a38355f6674
 *
 * Proper API route middleware handler, as I agree with the article, NextJs' implementation is extremely poor
 */
import { DbError } from './db';
import { AuthError } from '@/libs/feature-authentication';
import { verifyRequestOrigin } from 'lucia';
import { ZodError } from 'zod';
import { getLogger } from './Logger';

const logger = getLogger('MiddlewareHandler');

export type CustomResponse = { status: number; body: unknown };
export class ErrorResponse<T> extends Error {
  status: number;
  errors: T;
  constructor(message: string, errors: T, status: number) {
    super(message);
    (this.status = status), (this.errors = errors);
  }
}

export type Middleware = (req: Request) => Promise<CustomResponse | void>;
// export type Middleware = (req: Request, _next: () => void) => Promise<CustomResponse | void>;

export const apiHandler =
  (...middlewares: Middleware[]) =>
  async (request: Request) => {
    // CSRF protection
    const originHeader = request.headers.get('Origin');
    const hostHeader = request.headers.get('Host');
    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader]))
      return Response.json({}, { status: 403 });

    let result: CustomResponse | null = null;
    try {
      for (let i = 0; i < middlewares.length; i++) {
        // let nextInvoked = false;
        // const next = async () => {};

        result = (await middlewares[i](request)) || null;

        // if (!nextInvoked) break;
      }

      if (!result) return new Response(null, { status: 204 });
      return Response.json(result.body, { status: result.status });
    } catch (e) {
      if (e instanceof ErrorResponse)
        return Response.json({ errors: e.errors, message: e.message }, { status: e.status });

      if (e instanceof AuthError) return Response.json({ message: e.message }, { status: 401 });

      if (e instanceof DbError) return Response.json({ message: e.message }, { status: 409 });

      if (e instanceof ZodError) return Response.json(e.flatten().fieldErrors, { status: 422 });

      logger.error(e);
      return Response.json({ message: 'Unexpected internal error' }, { status: 500 });
    }
  };
