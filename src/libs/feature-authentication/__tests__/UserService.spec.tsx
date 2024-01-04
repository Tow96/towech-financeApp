// Libraries ------------------------------------------------------------------
import MockAdapter from 'axios-mock-adapter';
import { act } from 'react-dom/test-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import apiClient, { BASE_URL } from '@/utils/HttpCommon';
import { keys } from '@/utils/TanstackProvider';
// Tested Components ----------------------------------------------------------
import { useAuth, useLogin, useLogout } from '../UserService';

// Stubs ----------------------------------------------------------------------
const stubRefresh = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJfaWQiOiJmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmYiLCJyb2xlIjoidXNlciIsImFjY291bnRDb25maXJtZWQiOnRydWUsImlhdCI6MTcwNDM3Nzk5NCwiZXhwIjoxNzA0Mzc4MDU0fQ.KscPMBfszDRLRkJQneWnRxFsRVOhEebrrjBloXMHmXY',
};
const stubCredentials = { username: 'test', password: 'test', keepSession: false };
const stubLogin = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJfaWQiOiJmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmYiLCJyb2xlIjoidXNlciIsImFjY291bnRDb25maXJtZWQiOnRydWUsImlhdCI6MTcwNDM4NTIzMywiZXhwIjoxNzA0Mzg1MjM1fQ.QiYl4n1WRzzUsdHbtJWBe2E12AMiWYNtp9FMYJCqOXo',
};

// Mocks ----------------------------------------------------------------------
const mockAdapter = () => new MockAdapter(apiClient);
const mockTanstack = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper, queryClient };
};

// jest.mock('@/libs/feature-toasts/ToastService', () => {

// })

// Tests ----------------------------------------------------------------------
describe('UserService', () => {
  describe('useAuth', () => {
    it('Should obtain the token if call is successful', async () => {
      const mock = mockAdapter();
      const { wrapper } = mockTanstack();
      mock.onPost(`${BASE_URL}/authentication/refresh`).replyOnce(200, stubRefresh);

      const { result } = renderHook(() => useAuth(), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBe(stubRefresh.token);
    });
    it('Should be undefined if call is unsuccessful', async () => {
      const mock = mockAdapter();
      const { wrapper } = mockTanstack();
      mock.onPost(`${BASE_URL}/authentication/refresh`).networkErrorOnce();

      const { result } = renderHook(() => useAuth(), { wrapper });
      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.data).toBeUndefined();
    });
  });
  describe('useLogin', () => {
    it('Should obtain the token if call is successful', async () => {
      const mock = mockAdapter();
      const { wrapper, queryClient } = mockTanstack();
      mock.onPost(`${BASE_URL}/authentication/login`).replyOnce(200, stubLogin);

      const { result } = renderHook(() => useLogin(), { wrapper });
      act(() => result.current.mutate(stubCredentials));
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(queryClient.getQueryData([keys.USERKEY])).toBe(stubLogin.token);
    });
    it('Should set the token as null if call is unsuccessful', async () => {
      const mock = mockAdapter();
      const { wrapper, queryClient } = mockTanstack();
      mock.onPost(`${BASE_URL}/authentication/login`).networkErrorOnce();

      const { result } = renderHook(() => useLogin(), { wrapper });
      act(() => result.current.mutate(stubCredentials));
      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(queryClient.getQueryData([keys.USERKEY])).toBeNull();
    });
  });
  describe('useLogout', () => {
    it('Should set the token as null call is successful', async () => {
      const mock = mockAdapter();
      const { wrapper, queryClient } = mockTanstack();
      mock.onPost(`${BASE_URL}/authentication/logout`).replyOnce(204);

      const { result } = renderHook(() => useLogout(), { wrapper });
      act(() => result.current.mutate());
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(queryClient.getQueryData([keys.USERKEY])).toBeNull();
    });
    it('Should set the token as null if call is unsuccessful', async () => {
      const mock = mockAdapter();
      const { wrapper, queryClient } = mockTanstack();
      mock.onPost(`${BASE_URL}/authentication/logout`).networkErrorOnce();

      const { result } = renderHook(() => useLogout(), { wrapper });
      act(() => result.current.mutate());
      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(queryClient.getQueryData([keys.USERKEY])).toBeNull();
    });
  });
});
