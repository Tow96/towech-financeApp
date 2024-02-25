/**
 * @jest-environment node
 */
import '@testing-library/jest-dom';

import { NextRequest } from 'next/server';
import { apiHandler, CustomResponse, ErrorResponse } from '../../MiddlewareHandler';
import { ZodError } from 'zod';
import { DbError } from '@/libs/data-access/db';

describe('apiHandler', () => {
  it('Should run each middleware function in order, passing the given req', async () => {
    const mid_1 = jest.fn(async _ => {});
    const mid_2 = jest.fn(async _ => {});
    const mid_3 = jest.fn(async _ => {});
    const apiCall = jest.fn(async _ => {});

    await apiHandler(mid_1, mid_2, mid_3, apiCall)(new NextRequest('http://pesto/'));

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

    const response = await apiHandler(apiCall)(new NextRequest('http://pesto/'));

    expect(response.status).toBe(responseStatus);
    expect(await response.json()).toEqual(responseBody);
  });

  it('Should return a 204 code response if the last fn does not return a response', async () => {
    const apiCall = async () => {};

    const response = await apiHandler(apiCall)(new NextRequest('http://pesto'));

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

    const response = await apiHandler(mid_1, mid_2, apiCall)(new NextRequest('http://pesto'));

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

    const response = await apiHandler(mid_1, apiCall)(new NextRequest('http://pesto'));

    expect(response.status).toBe(422);
    // expect(await response.json()).toEqual({ message: errorMessage, errors });
  });

  it('Should return a 409 code response if any of the functions throws a DatabaseError object', async () => {
    const mid_1 = jest.fn(async _ => {});
    const apiCall = jest.fn(async _ => {
      throw new DbError('Already exists');
    });

    const response = await apiHandler(mid_1, apiCall)(new NextRequest('http://pesto'));

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ message: 'Already exists' });
  });

  it('Should return an unxepected error message if any other error type is thrown', async () => {
    const mid_1 = jest.fn(async _ => {});
    const mid_2 = jest.fn(async _ => {
      throw new Error('Randmon error');
    });
    const apiCall = jest.fn(async _ => {});

    const response = await apiHandler(mid_1, mid_2, apiCall)(new NextRequest('http://pesto'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ message: 'Unexpected internal error' });
  });
});
