// Libraries ------------------------------------------------------------------
import MockAdapter from 'axios-mock-adapter';

// Tested Components ----------------------------------------------------------
import { apiClient, BASE_URL } from '../HttpCommon';
import { HttpStatusCode } from 'axios';

// Stubs ----------------------------------------------------------------------
const stubResponse = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJfaWQiOiJmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmYiLCJyb2xlIjoidXNlciIsImFjY291bnRDb25maXJtZWQiOnRydWUsImlhdCI6MTcwNDM3Nzk5NCwiZXhwIjoxNzA0Mzc4MDU0fQ.KscPMBfszDRLRkJQneWnRxFsRVOhEebrrjBloXMHmXY',
};
const stubError = {
  message: 'Invalid credentials',
};

const testAll = async (client: apiClient, expected: unknown) => {
  expect(await client.delete('test').catch(e => e)).toEqual(expected);
  expect(await client.get('test').catch(e => e)).toEqual(expected);
  expect(await client.patch('test').catch(e => e)).toEqual(expected);
  expect(await client.post('test').catch(e => e)).toEqual(expected);
  expect(await client.postWithCredentials('test').catch(e => e)).toEqual(expected);
  expect(await client.put('test').catch(e => e)).toEqual(expected);
};
// Tests ----------------------------------------------------------------------
describe('api provider', () => {
  it('should only return the endpoint data when the response is successful', async () => {
    const client = new apiClient();
    const mockAdapter = new MockAdapter(client.axiosInstance);

    mockAdapter.onAny('test').reply(200, stubResponse);

    testAll(client, stubResponse);
  });
  it('should only return the endpoint data when the response is successful', async () => {
    const client = new apiClient();
    const mockAdapter = new MockAdapter(client.axiosInstance);

    mockAdapter.onAny('test').reply(421, stubError);

    const res: any = { message: stubError.message, status: 421 };
    testAll(client, res);
  });
  it('should provide a default error message if there is none', async () => {
    const client = new apiClient();
    const mockAdapter = new MockAdapter(client.axiosInstance);

    mockAdapter.onAny(`test`).reply(400, undefined);

    testAll(client, { message: HttpStatusCode[400], status: 400 });
  });
  it('should send an unexpected error if there is no response', async () => {
    const client = new apiClient();
    const mockAdapter = new MockAdapter(client.axiosInstance);

    mockAdapter.onAny(`${BASE_URL}/test`).networkError();

    testAll(client, { message: HttpStatusCode[500], status: 500 });
  });
});
