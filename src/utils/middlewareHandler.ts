/** middlewareHandler.ts
 * https://medium.com/sopra-steria-norge/how-to-write-actual-api-middleware-for-next-js-2a38355f6674
 *
 * Proper API route middleware handler, as I agree with the article, NextJs' implementation is extremely poor
 */

import { NextRequest, NextResponse } from 'next/server';

export type CustomResponse = { status: number; body: unknown };
export class ErrorResponse<T> extends Error {
  status: number;
  errors: T;
  constructor(message: string, errors: T, status: number) {
    super(message);
    (this.status = status), (this.errors = errors);
  }
}

export type Middleware = (req: NextRequest) => Promise<CustomResponse | void>;
// export type Middleware = (req: NextRequest, _next: () => void) => Promise<CustomResponse | void>;

export const apiHandler =
  (...middlewares: Middleware[]) =>
  async (request: NextRequest) => {
    let result: CustomResponse | null = null;

    try {
      for (let i = 0; i < middlewares.length; i++) {
        // let nextInvoked = false;
        // const next = async () => {};

        result = (await middlewares[i](request)) || null;

        // if (!nextInvoked) break;
      }

      if (!result) return new NextResponse(null, { status: 204 });
      return NextResponse.json(result.body, { status: result.status });
    } catch (e) {
      if (e instanceof ErrorResponse)
        return NextResponse.json({ errors: e.errors, message: e.message }, { status: e.status });

      console.error(e); // TODO: proper logging
      return NextResponse.json({ message: 'Unexpected internal error' }, { status: 500 });
    }
  };
