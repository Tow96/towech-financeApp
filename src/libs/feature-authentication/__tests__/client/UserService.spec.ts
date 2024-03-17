// Libraries ------------------------------------------------------------------
import { act } from 'react-dom/test-utils';
import { renderHook, waitFor } from '@testing-library/react';
import { keys } from '@/utils/TanstackProvider';
import {
  mockTanstack,
  mockPatch,
  mockGet,
  mockPost,
  mockDelete,
} from '@/utils/__mocks__/tanstack.mock';
// Tested Components ----------------------------------------------------------
import { useAuth, useEditUser, useLogin, useLogout } from '../../UserService';
import { stubOwner } from '../../__mocks__/DataAccessDb';

// Tests ----------------------------------------------------------------------
describe('UserService.useAuth', () => {
  describe('Given no/invalid auth cookie', () => {
    test('- Then it should store an undefined with a failed status', async () => {
      const { wrapper } = mockTanstack();
      mockGet.mockRejectedValue({ message: 'Invalid credentials' });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBeTruthy());
      expect(result.current.data).toBeUndefined();
    });
  });
  describe('Given a valid cookie', () => {
    test('- Then it should store the user an have a successful status', async () => {
      const { wrapper } = mockTanstack();
      mockGet.mockResolvedValueOnce(stubOwner);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(result.current.data).toEqual(stubOwner);
    });
  });
});

describe('UserSerivce.useLogin', () => {
  describe('Given invalid credentials', () => {
    test('- Then it should do nothing to the stored data and set an error status', async () => {
      const initialData = 'this is a test';
      const { wrapper, queryClient } = mockTanstack();
      mockPost.mockRejectedValueOnce({ message: 'Invalid credentials' });
      queryClient.setQueryData([keys.USERKEY], initialData);

      const { result } = renderHook(() => useLogin(), { wrapper });
      act(() => result.current.mutate({ email: 'fake', password: 'false', keepSession: true }));

      await waitFor(() => expect(result.current.isError).toBeTruthy());
      expect(queryClient.getQueryData([keys.USERKEY])).toEqual(initialData);
    });
  });
  describe('Given valid credentials', () => {
    test('- Then it should store the user and set the status as successful', async () => {
      const { wrapper, queryClient } = mockTanstack();
      mockPost.mockReturnValueOnce(stubOwner);

      const { result } = renderHook(() => useLogin(), { wrapper });
      act(() => result.current.mutate({ email: 'real', keepSession: true, password: 'pass' }));

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(queryClient.getQueryData([keys.USERKEY])).toEqual(stubOwner);
    });
  });
});

describe('UserService.useLogout', () => {
  describe('When the call is unsuccesful', () => {
    test('- It should set the value as error and clear the user', async () => {
      const { wrapper, queryClient } = mockTanstack();
      queryClient.setQueryData([keys.USERKEY], stubOwner);
      mockDelete.mockRejectedValueOnce({ message: 'Something happened' });

      const { result } = renderHook(() => useLogout(), { wrapper });
      act(() => result.current.mutate(false));

      await waitFor(() => expect(result.current.isError).toBeTruthy());
      expect(queryClient.getQueryData([keys.USERKEY])).toBeNull();
    });
  });
  describe('When the call is successful', () => {
    test('- It should set the value as success and clear the user', async () => {
      const { wrapper, queryClient } = mockTanstack();
      queryClient.setQueryData([keys.USERKEY], stubOwner);
      mockDelete.mockReturnValueOnce({ message: 'yes' });

      const { result } = renderHook(() => useLogout(), { wrapper });
      act(() => result.current.mutate(false));

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(queryClient.getQueryData([keys.USERKEY])).toBeNull();
    });
  });
});

describe('UserService.useEditUser', () => {
  describe('When the call is unsuccessful', () => {
    test('- Then it should do nothing to the stored data and set an error status', async () => {
      const { wrapper, queryClient } = mockTanstack();
      mockPatch.mockRejectedValueOnce({ message: 'Invalid credentials' });
      queryClient.setQueryData([keys.USERKEY], stubOwner);

      const { result } = renderHook(() => useEditUser(), { wrapper });
      act(() => result.current.mutate({ email: 'newmail@mail.com' }));

      await waitFor(() => expect(result.current.isError).toBeTruthy());
      expect(queryClient.getQueryData([keys.USERKEY])).toEqual(stubOwner);
    });
  });
  describe('When the call is successful', () => {
    test('- Then it should update the user with the received info', async () => {
      const { wrapper, queryClient } = mockTanstack();
      mockPatch.mockReturnValueOnce({ ...stubOwner, email: 'newmail@gmail.com' });
      queryClient.setQueryData([keys.USERKEY], stubOwner);

      const { result } = renderHook(() => useEditUser(), { wrapper });
      act(() => result.current.mutate({ email: 'newmail@mail.com' }));

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(queryClient.getQueryData([keys.USERKEY])).toEqual({
        ...stubOwner,
        email: 'newmail@gmail.com',
      });
    });
  });
});
//     describe('useResendMail', () => {
//       it('should call the correct endpoint', async () => {
//         const { wrapper } = mockTanstack();
//         mockGet.mockReturnValueOnce({});

//         const { result } = renderHook(() => useResendMail(), { wrapper });
//         act(() => result.current.mutate());
//         await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

//         expect(mockGet).toHaveBeenLastCalledWith(`/users/email`, undefined);
//       });
//     });
//     describe('usePasswordChange', () => {
//       it('should call the correct endpoint', async () => {
//         const { wrapper } = mockTanstack();
//         mockPut.mockReturnValueOnce({});

//         const payload = { confirmPassword: 'new', newPassword: 'new', oldPassword: 'old' };
//         const { result } = renderHook(() => usePasswordChange(), { wrapper });
//         act(() => result.current.mutate(payload));
//         await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

//         expect(mockPut).toHaveBeenLastCalledWith('/users/password', undefined, payload);
//       });
//     });
//     describe('usePasswordReset', () => {
//       it('should call the correct endpoint', async () => {
//         const { wrapper } = mockTanstack();
//         mockPostCred.mockReturnValueOnce({});

//         const { result } = renderHook(() => usePasswordReset(), { wrapper });
//         act(() => result.current.mutate());
//         await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

//         expect(mockPostCred).toHaveBeenLastCalledWith('/users/reset', { username: undefined });
//       });
//     });
//     describe('useGlobalLogout', () => {
//       it('Should set the token as null call is successful', async () => {
//         const { wrapper, queryClient } = mockTanstack();
//         mockPostCred.mockImplementationOnce(() => {});

//         const { result } = renderHook(() => useLogoutAll(), { wrapper });
//         act(() => result.current.mutate());
//         await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

//         expect(mockPostCred).toHaveBeenLastCalledWith(`/authentication/logout-all`, undefined);
//         expect(queryClient.getQueryData([keys.USERKEY])).toBeNull();
//       });
//       it('Should set the token as null if call is unsuccessful', async () => {
//         const { wrapper, queryClient } = mockTanstack();
//         mockPostCred.mockRejectedValueOnce({} as never);

//         const { result } = renderHook(() => useLogoutAll(), { wrapper });
//         act(() => result.current.mutate());
//         await waitFor(() => expect(result.current.isError).toBeTruthy());

//         expect(queryClient.getQueryData([keys.USERKEY])).toBeNull();
//       });
//     });
//   });
// });
