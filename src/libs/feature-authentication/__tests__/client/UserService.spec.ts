// Libraries ------------------------------------------------------------------
import { act } from 'react-dom/test-utils';
import { renderHook, waitFor } from '@testing-library/react';
import { keys } from '@/utils/TanstackProvider';
import {
  mockTanstack,
  mockPostCred,
  mockPatch,
  mockGet,
  mockPut,
} from '@/utils/__mocks__/tanstack.mock';
// Tested Components ----------------------------------------------------------
import {
  useAuth,
  useEditUser,
  useLogoutAll,
  useLogin,
  useLogout,
  usePasswordChange,
  usePasswordReset,
  useResendMail,
} from '../../UserService';

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

// Tests ----------------------------------------------------------------------
describe('UserService', () => {
  describe('Query', () => {
    it('Should obtain the token if call is successful', async () => {
      const { wrapper } = mockTanstack();
      mockPostCred.mockReturnValueOnce(stubRefresh);

      const { result } = renderHook(() => useAuth(), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

      expect(mockPostCred).toHaveBeenLastCalledWith('/authentication/refresh', undefined);
      expect(result.current.data).toEqual(stubRefreshUser);
    });
    it('Should be undefined if call is unsuccessful', async () => {
      const { wrapper } = mockTanstack();
      mockPostCred.mockRejectedValueOnce({});

      const { result } = renderHook(() => useAuth(), { wrapper });
      await waitFor(() => expect(result.current.isError).toBeTruthy());

      expect(result.current.data).toBeUndefined();
    });
  });

  describe('Mutations', () => {
    describe('useLogin', () => {
      it('Should obtain the token if call is successful', async () => {
        const { wrapper, queryClient } = mockTanstack();
        mockPostCred.mockReturnValueOnce(stubLogin);

        const { result } = renderHook(() => useLogin(), { wrapper });
        act(() => result.current.mutate(stubCredentials));
        await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

        expect(mockPostCred).toHaveBeenLastCalledWith('/authentication/login', stubCredentials);
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
        const { wrapper, queryClient } = mockTanstack();
        mockPostCred.mockReturnValueOnce({});

        const { result } = renderHook(() => useLogout(), { wrapper });
        act(() => result.current.mutate());
        await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

        expect(mockPostCred).toHaveBeenLastCalledWith('/authentication/logout', undefined);
        expect(queryClient.getQueryData([keys.USERKEY])).toBeNull();
      });
      it('Should set the token as null if call is unsuccessful', async () => {
        const { wrapper, queryClient } = mockTanstack();
        mockPostCred.mockRejectedValueOnce({});

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

        const { wrapper, queryClient } = mockTanstack();
        mockPostCred.mockReturnValueOnce(stubRefresh);
        mockPatch.mockReturnValueOnce(response);

        const { result: refresh } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => expect(refresh.current.isSuccess).toBeTruthy());

        const { result } = renderHook(() => useEditUser(), { wrapper });
        act(() => result.current.mutate({ name: newName }));
        await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

        expect(mockPatch).toHaveBeenLastCalledWith(
          `/users/${stubRefreshUser._id}`,
          stubRefresh.token,
          { name: newName }
        );
        expect(queryClient.getQueryData([keys.USERKEY])).toEqual({
          ...stubRefreshUser,
          ...response,
        });
      });
    });
    describe('useResendMail', () => {
      it('should call the correct endpoint', async () => {
        const { wrapper } = mockTanstack();
        mockGet.mockReturnValueOnce({});

        const { result } = renderHook(() => useResendMail(), { wrapper });
        act(() => result.current.mutate());
        await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

        expect(mockGet).toHaveBeenLastCalledWith(`/users/email`, undefined);
      });
    });
    describe('usePasswordChange', () => {
      it('should call the correct endpoint', async () => {
        const { wrapper } = mockTanstack();
        mockPut.mockReturnValueOnce({});

        const payload = { confirmPassword: 'new', newPassword: 'new', oldPassword: 'old' };
        const { result } = renderHook(() => usePasswordChange(), { wrapper });
        act(() => result.current.mutate(payload));
        await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

        expect(mockPut).toHaveBeenLastCalledWith('/users/password', undefined, payload);
      });
    });
    describe('usePasswordReset', () => {
      it('should call the correct endpoint', async () => {
        const { wrapper } = mockTanstack();
        mockPostCred.mockReturnValueOnce({});

        const { result } = renderHook(() => usePasswordReset(), { wrapper });
        act(() => result.current.mutate());
        await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

        expect(mockPostCred).toHaveBeenLastCalledWith('/users/reset', { username: undefined });
      });
    });
    describe('useGlobalLogout', () => {
      it('Should set the token as null call is successful', async () => {
        const { wrapper, queryClient } = mockTanstack();
        mockPostCred.mockImplementationOnce(() => {});

        const { result } = renderHook(() => useLogoutAll(), { wrapper });
        act(() => result.current.mutate());
        await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

        expect(mockPostCred).toHaveBeenLastCalledWith(`/authentication/logout-all`, undefined);
        expect(queryClient.getQueryData([keys.USERKEY])).toBeNull();
      });
      it('Should set the token as null if call is unsuccessful', async () => {
        const { wrapper, queryClient } = mockTanstack();
        mockPostCred.mockRejectedValueOnce({} as never);

        const { result } = renderHook(() => useLogoutAll(), { wrapper });
        act(() => result.current.mutate());
        await waitFor(() => expect(result.current.isError).toBeTruthy());

        expect(queryClient.getQueryData([keys.USERKEY])).toBeNull();
      });
    });
  });
});
