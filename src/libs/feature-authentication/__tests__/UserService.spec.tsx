// Libraries ------------------------------------------------------------------
import MockAdapter from 'axios-mock-adapter';
import { act } from 'react-dom/test-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import apiClient, { BASE_URL } from '@/utils/HttpCommon';
import { keys } from '@/utils/TanstackProvider';
// Tested Components ----------------------------------------------------------
import {
  useAuth,
  useEditUser,
  useLogin,
  useLogout,
  usePasswordChange,
  useResendMail,
} from '../UserService';

// Stubs ----------------------------------------------------------------------
const stubUser = {
  name: 'test',
  username: 'testuser@provider.com',
  _id: 'ffffffffffffffffffffffff',
  role: 'user',
  accountConfirmed: true,
};
const stubRefresh = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsInVzZXJuYW1lIjoidGVzdHVzZXJAcHJvdmlkZXIuY29tIiwiX2lkIjoiZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmIiwicm9sZSI6InVzZXIiLCJhY2NvdW50Q29uZmlybWVkIjp0cnVlLCJpYXQiOjE3MDQzNzc5OTQsImV4cCI6MTcwNDM3ODA1NH0.P-TbFlXnX7kFP2WwcWGjc3-SJq2ppLTMjSGmsmItbg0',
};
const stubRefreshUser = {
  ...stubUser,
  iat: 1704377994,
  exp: 1704378054,
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsInVzZXJuYW1lIjoidGVzdHVzZXJAcHJvdmlkZXIuY29tIiwiX2lkIjoiZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmIiwicm9sZSI6InVzZXIiLCJhY2NvdW50Q29uZmlybWVkIjp0cnVlLCJpYXQiOjE3MDQzNzc5OTQsImV4cCI6MTcwNDM3ODA1NH0.P-TbFlXnX7kFP2WwcWGjc3-SJq2ppLTMjSGmsmItbg0',
};
const stubCredentials = { username: 'test', password: 'test', keepSession: false };
const stubLogin = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsInVzZXJuYW1lIjoidGVzdHVzZXJAcHJvdmlkZXIuY29tIiwiX2lkIjoiZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmIiwicm9sZSI6InVzZXIiLCJhY2NvdW50Q29uZmlybWVkIjp0cnVlLCJpYXQiOjE3MDQzODUyMzMsImV4cCI6MTcwNDM4NTIzNX0.VIWq3x51tDLzZXYLDQn8V8mL9EfNCiClkbzErDazaAM',
};
const stubLoginUser = {
  ...stubUser,
  iat: 1704385233,
  exp: 1704385235,
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsInVzZXJuYW1lIjoidGVzdHVzZXJAcHJvdmlkZXIuY29tIiwiX2lkIjoiZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmIiwicm9sZSI6InVzZXIiLCJhY2NvdW50Q29uZmlybWVkIjp0cnVlLCJpYXQiOjE3MDQzODUyMzMsImV4cCI6MTcwNDM4NTIzNX0.VIWq3x51tDLzZXYLDQn8V8mL9EfNCiClkbzErDazaAM',
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

// Tests ----------------------------------------------------------------------
describe('UserService', () => {
  describe('Query', () => {
    it('Should obtain the token if call is successful', async () => {
      const mock = mockAdapter();
      const { wrapper } = mockTanstack();
      mock.onPost(`${BASE_URL}/authentication/refresh`).replyOnce(200, stubRefresh);

      const { result } = renderHook(() => useAuth(), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

      expect(result.current.data).toEqual(stubRefreshUser);
    });
    it('Should be undefined if call is unsuccessful', async () => {
      const mock = mockAdapter();
      const { wrapper } = mockTanstack();
      mock.onPost(`${BASE_URL}/authentication/refresh`).networkErrorOnce();

      const { result } = renderHook(() => useAuth(), { wrapper });
      await waitFor(() => expect(result.current.isError).toBeTruthy());

      expect(result.current.data).toBeUndefined();
    });
  });

  describe('Mutations', () => {
    describe('useLogin', () => {
      it('Should obtain the token if call is successful', async () => {
        const mock = mockAdapter();
        const { wrapper, queryClient } = mockTanstack();
        mock.onPost(`${BASE_URL}/authentication/login`).replyOnce(200, stubLogin);

        const { result } = renderHook(() => useLogin(), { wrapper });
        act(() => result.current.mutate(stubCredentials));
        await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

        expect(queryClient.getQueryData([keys.USERKEY])).toEqual(stubLoginUser);
      });
      // it('Should set the token as null if call is unsuccessful', async () => {
      //   const mock = mockAdapter();
      //   const { wrapper, queryClient } = mockTanstack();
      //   mock.onPost(`${BASE_URL}/authentication/login`).networkErrorOnce();

      //   const { result } = renderHook(() => useLogin(), { wrapper });
      //   act(() => result.current.mutate(stubCredentials));
      //   await waitFor(() => expect(result.current.isError).toBeTruthy());

      //   expect(queryClient.getQueryData([keys.USERKEY])).toBeNull();
      // });
    });
    describe('useLogout', () => {
      it('Should set the token as null call is successful', async () => {
        const mock = mockAdapter();
        const { wrapper, queryClient } = mockTanstack();
        mock.onPost(`${BASE_URL}/authentication/logout`).replyOnce(204);

        const { result } = renderHook(() => useLogout(), { wrapper });
        act(() => result.current.mutate());
        await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

        expect(queryClient.getQueryData([keys.USERKEY])).toBeNull();
      });
      it('Should set the token as null if call is unsuccessful', async () => {
        const mock = mockAdapter();
        const { wrapper, queryClient } = mockTanstack();
        mock.onPost(`${BASE_URL}/authentication/logout`).networkErrorOnce();

        const { result } = renderHook(() => useLogout(), { wrapper });
        act(() => result.current.mutate());
        await waitFor(() => expect(result.current.isError).toBeTruthy());

        expect(queryClient.getQueryData([keys.USERKEY])).toBeNull();
      });
    });
    describe('useEditUser', () => {
      it('should update the user with the received information', async () => {
        const newName = 'newName';
        const response = { ...stubUser, name: newName };

        const mock = mockAdapter();
        const { wrapper, queryClient } = mockTanstack();
        mock.onPost(`${BASE_URL}/authentication/refresh`).replyOnce(200, stubRefresh);
        mock.onPatch(`${BASE_URL}/users/${stubRefreshUser._id}`).replyOnce(200, response);

        const { result: refresh } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => expect(refresh.current.isSuccess).toBeTruthy());

        const { result } = renderHook(() => useEditUser(), { wrapper });
        act(() => result.current.mutate({ name: newName }));
        await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

        expect(queryClient.getQueryData([keys.USERKEY])).toEqual({
          ...stubRefreshUser,
          ...response,
        });
      });
    });
    describe('useResendMail', () => {
      it('should call the correct endpoint', async () => {
        const mock = mockAdapter();
        const { wrapper } = mockTanstack();
        mock.onGet(`${BASE_URL}/users/email`).replyOnce(204);

        const { result } = renderHook(() => useResendMail(), { wrapper });
        act(() => result.current.mutate());
        await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

        expect(mock.history.get[0].url).toBe('/users/email');
      });
    });
    describe('usePasswordChange', () => {
      it('should call the correct endpoint', async () => {
        const mock = mockAdapter();
        const { wrapper } = mockTanstack();
        mock.onPut(`${BASE_URL}/users/password`).replyOnce(204);

        const { result } = renderHook(() => usePasswordChange(), { wrapper });
        act(() =>
          result.current.mutate({ confirmPassword: 'new', newPassword: 'new', oldPassword: 'old' })
        );
        await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

        expect(mock.history.put[0].url).toBe('/users/password');
      });
    });
  });
});
