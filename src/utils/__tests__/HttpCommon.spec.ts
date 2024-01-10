// Libraries ------------------------------------------------------------------
import MockAdapter from 'axios-mock-adapter';

// Tested Components ----------------------------------------------------------
import apiClient, { BASE_URL } from '../HttpCommon';
import { HttpStatusCode } from 'axios';

// Stubs ----------------------------------------------------------------------
const stubResponse = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJfaWQiOiJmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmYiLCJyb2xlIjoidXNlciIsImFjY291bnRDb25maXJtZWQiOnRydWUsImlhdCI6MTcwNDM3Nzk5NCwiZXhwIjoxNzA0Mzc4MDU0fQ.KscPMBfszDRLRkJQneWnRxFsRVOhEebrrjBloXMHmXY',
};
const stubError = {
  message: 'Invalid credentials',
};

// Mocks ----------------------------------------------------------------------
const mockAdapter = () => new MockAdapter(apiClient);

const testAll = async (expected: unknown) => {
  const getRes = await apiClient.get('test').catch(e => e);
  const deleteRes = await apiClient.delete('test').catch(e => e);
  const postRes = await apiClient.post('test').catch(e => e);
  const putRes = await apiClient.put('test').catch(e => e);
  const patchRes = await apiClient.patch('test').catch(e => e);

  expect(getRes).toEqual(expected);
  expect(deleteRes).toEqual(expected);
  expect(postRes).toEqual(expected);
  expect(putRes).toEqual(expected);
  expect(patchRes).toEqual(expected);
};

// Tests ----------------------------------------------------------------------
describe('Common api provider', () => {
  it.todo('Should attach the auth token to all requests');

  it('Should just return the data when fulfilling', async () => {
    const mock = mockAdapter();
    mock.onAny(`${BASE_URL}/test`).reply(200, stubResponse);

    testAll(stubResponse);
  });

  it('Should just return the error message when failing', async () => {
    const mock = mockAdapter();
    mock.onAny(`${BASE_URL}/test`).reply(421, stubError);

    testAll({ message: stubError.message, status: 421 });
  });

  it('If there is no error message, axios should use a default one', async () => {
    const mock = mockAdapter();
    mock.onAny(`${BASE_URL}/test`).reply(400, undefined);

    testAll({ message: HttpStatusCode[400], status: 400 });
  });

  it('If there is no response, then an unexpected error is raised', async () => {
    const mock = mockAdapter();
    mock.onAny(`${BASE_URL}/test`).networkError();

    testAll({ message: 'Unexpected Error: Network Error', status: 0 });
  });
});
