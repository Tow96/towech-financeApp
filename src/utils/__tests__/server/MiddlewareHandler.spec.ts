/**
 * @jest-environment node
 */
import '@testing-library/jest-dom';

import { apiHandler, CustomResponse, ErrorResponse } from '../../MiddlewareHandler';
import { ZodError } from 'zod';
import { DbError } from '@/utils/db';
import { AuthError } from '@/libs/feature-authentication';
import { mockRequest } from '@/utils/__mocks__/Request';

describe('apiHandler', () => {
  it('Should return a 403 response if the Origin header is not present', async () => {
    const response = await apiHandler()(mockRequest({ headers: { Origin: undefined } }), {});
    expect(response.status).toBe(403);
  });
  it('Should return a 403 response if the Host header is not present', async () => {
    const response = await apiHandler()(mockRequest({ headers: { Host: undefined } }), {});
    expect(response.status).toBe(403);
  });
  it('Should return a 403 response if the Host and Origin headers do not match', async () => {
    const response = await apiHandler()(mockRequest({ headers: { Origin: 'a', Host: 'b' } }), {});
    expect(response.status).toBe(403);
  });

  it('Should run each middleware function in order, passing the given req', async () => {
    const mid_1 = jest.fn(async _ => {});
    const mid_2 = jest.fn(async _ => {});
    const mid_3 = jest.fn(async _ => {});
    const apiCall = jest.fn(async _ => {});

    await apiHandler(mid_1, mid_2, mid_3, apiCall)(mockRequest(), {});

    expect(mid_1).toHaveBeenCalledTimes(1);
    expect(mid_2).toHaveBeenCalledTimes(1);
    expect(mid_3).toHaveBeenCalledTimes(1);
    expect(apiCall).toHaveBeenCalledTimes(1);
  });

  it('Should return the message of the last fn if given one', async () => {
    const responseBody = { test: 'message' };
    const responseStatus = 201;
    const message: CustomResponse = { body: responseBody, status: responseStatus };
    const apiCall = async () => message;

    const response = await apiHandler(apiCall)(mockRequest(), {});

    expect(response.status).toBe(responseStatus);
    expect(await response.json()).toEqual(responseBody);
  });

  it('Should return a 204 code response if the last fn does not return a response', async () => {
    const apiCall = async () => {};

    const response = await apiHandler(apiCall)(mockRequest(), {});

    expect(response.status).toBe(204);
    expect(response.body).toBeNull();
  });

  it('Should return an specific response if any of the functions throws an ErrorResponse object', async () => {
    const errorStatus = 422;
    const errorMessage = 'Controlled error';
    const errors = { test: 'this is an example', test2: 'this is another example' };
    const mid_1 = jest.fn(async _ => {});
    const mid_2 = jest.fn(async _ => {
      throw new ErrorResponse(errorMessage, errors, errorStatus);
    });
    const apiCall = jest.fn(async _ => {});

    const response = await apiHandler(mid_1, mid_2, apiCall)(mockRequest(), {});

    expect(response.status).toBe(errorStatus);
    expect(await response.json()).toEqual({ message: errorMessage, errors });
  });

  it('Should return a 422 response if any of the functions throws a ZodError object', async () => {
    const mid_1 = jest.fn(async _ => {});
    const apiCall = jest.fn(async _ => {
      throw new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          path: ['test'],
          fatal: false,
          received: 'integer',
          message: 'Required',
        },
      ]);
    });

    const response = await apiHandler(mid_1, apiCall)(mockRequest(), {});

    expect(response.status).toBe(422);
    // expect(await response.json()).toEqual({ message: errorMessage, errors });
  });

  it('Should return a 409 code response if any of the functions throws a DatabaseError object', async () => {
    const mid_1 = jest.fn(async _ => {});
    const apiCall = jest.fn(async _ => {
      throw new DbError('Already exists');
    });

    const response = await apiHandler(mid_1, apiCall)(mockRequest(), {});

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ message: 'Already exists' });
  });

  it('Should return a 401 error if any of the functions throws an AuthError object', async () => {
    const mid_1 = jest.fn(async _ => {});
    const apiCall = jest.fn(async _ => {
      throw new AuthError('Unauthorized');
    });

    const response = await apiHandler(mid_1, apiCall)(mockRequest(), {});

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ message: 'Unauthorized' });
  });

  it('Should return an unxepected error message if any other error type is thrown', async () => {
    const mid_1 = jest.fn(async _ => {});
    const mid_2 = jest.fn(async _ => {
      throw new Error('Random error');
    });
    const apiCall = jest.fn(async _ => {});

    const response = await apiHandler(mid_1, mid_2, apiCall)(mockRequest(), {});

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ message: 'Unexpected internal error' });
  });
});
