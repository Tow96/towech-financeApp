// Libraries ------------------------------------------------------------------
import { act } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { keys } from '@/utils/TanstackProvider';
import {
  mockTanstack,
  mockGet,
  mockPost,
  mockDelete,
  mockPut,
} from '@/utils/__mocks__/tanstack.mock';
import { UpdateWallet, Wallet } from '../../Schema';
import { stubOwner } from '@/libs/feature-authentication/__mocks__/DataAccessDb';
// Tested Components ----------------------------------------------------------
import {
  useAddWallet,
  useEditWallet,
  useWalletIds,
  useWallet,
  useDeleteWallet,
} from '../../TransactionService';
import { stubWallet } from '../../__mocks__/DataAccessDb';

// Tests ----------------------------------------------------------------------
describe('TransactionService.useWalletIds', () => {
  describe('Given a failed response', () => {
    test('- Then it should store an undefined with a failed status', async () => {
      const { wrapper } = mockTanstack();
      mockGet.mockRejectedValue({ message: 'Invalid credentials' });

      const { result } = renderHook(() => useWalletIds(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBeTruthy());
      expect(result.current.data).toBeUndefined();
    });
  });
  describe('Given a successful response', () => {
    test('- Then it should store the wallets and have a success status', async () => {
      const { wrapper } = mockTanstack();
      mockGet.mockResolvedValueOnce([stubWallet]);

      const { result } = renderHook(() => useWalletIds(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(result.current.data).toEqual([stubWallet.id]);
    });
  });
});

describe('TransactionService.useWallet', () => {
  describe('Given a failed response', () => {
    test('- Then it should store an undefined with a failed status', async () => {
      const { wrapper } = mockTanstack();
      mockGet.mockRejectedValue({ message: 'Invalid credentials' });

      const { result } = renderHook(() => useWallet(stubWallet.id), { wrapper });

      await waitFor(() => expect(result.current.isError).toBeTruthy());
      expect(result.current.data).toBeUndefined();
    });
  });
  describe('Given a successful response', () => {
    test('- Then it should store the wallets and have a success status', async () => {
      const { wrapper } = mockTanstack();
      mockGet.mockResolvedValueOnce(stubWallet);

      const { result } = renderHook(() => useWallet(stubWallet.id), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(result.current.data).toEqual(stubWallet);
    });
  });
});

describe('TransactionService.useAddWallet', () => {
  describe('Given a failed response', () => {
    test('- Then it should do nothing to the stored data and set an error status', async () => {
      const { wrapper } = mockTanstack();
      mockPost.mockRejectedValueOnce({ message: 'Failure' });

      const { result } = renderHook(() => useAddWallet(), { wrapper });
      act(() => result.current.mutate({ name: 'new wallet' }));

      await waitFor(() => expect(result.current.isError).toBeTruthy());
    });
  });
  describe('Given a successful response', () => {
    test('- Then it should append the newly created wallet to the list', async () => {
      const newWallet: Wallet = {
        createdAt: new Date(),
        iconId: 0,
        id: '3478',
        money: 0,
        name: 'new wallet',
        updatedAt: new Date(),
        userId: stubOwner.id,
      };
      const { wrapper, queryClient } = mockTanstack();
      mockPost.mockReturnValueOnce(newWallet);

      const { result } = renderHook(() => useAddWallet(), { wrapper });
      act(() => result.current.mutate(newWallet));

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(queryClient.getQueryData([keys.WALLETKEY, newWallet.id])).toEqual(newWallet);
    });
  });
});

describe('TransactionService.useEditWallet', () => {
  describe('Given a failed response', () => {
    test('- Then it should do nothing to the stored data and set an error status', async () => {
      const { wrapper, queryClient } = mockTanstack();
      mockPut.mockRejectedValueOnce({ message: 'Failure' });
      queryClient.setQueryData([keys.WALLETKEY, stubWallet.id], stubWallet);

      const { result } = renderHook(() => useEditWallet(stubWallet.id), { wrapper });
      act(() => result.current.mutate({ id: stubWallet.id, wallet: { name: 'new wallet' } }));

      await waitFor(() => expect(result.current.isError).toBeTruthy());
      expect(queryClient.getQueryData([keys.WALLETKEY, stubWallet.id])).toEqual(stubWallet);
    });
  });
  describe('Given a successful response', () => {
    test('- Then it should update the selected wallet', async () => {
      const updateWallet: UpdateWallet = { name: 'newWallet' };
      const { wrapper, queryClient } = mockTanstack();
      queryClient.setQueryData([keys.WALLETKEY, stubWallet.id], stubWallet);
      mockPut.mockReturnValueOnce({ ...stubWallet, ...updateWallet });

      const { result } = renderHook(() => useEditWallet(stubWallet.id), { wrapper });
      act(() => result.current.mutate({ id: stubWallet.id, wallet: updateWallet }));

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(queryClient.getQueryData([keys.WALLETKEY, stubWallet.id])).toEqual({
        ...stubWallet,
        ...updateWallet,
      });
    });
  });
});

describe('TransactionService.useDeleteWallet', () => {
  describe('Given a failed response', () => {
    test('- Then it should do nothing to the stored data and set an error status', async () => {
      const { wrapper, queryClient } = mockTanstack();
      mockDelete.mockRejectedValueOnce({ message: 'Failure' });
      queryClient.setQueryData([keys.WALLETKEY, stubWallet.id], stubWallet);

      const { result } = renderHook(() => useDeleteWallet(stubWallet.id), { wrapper });
      act(() => result.current.mutate());

      await waitFor(() => expect(result.current.isError).toBeTruthy());
      expect(queryClient.getQueryData([keys.WALLETKEY, stubWallet.id])).toEqual(stubWallet);
    });
  });
  describe('Given a successful response', () => {
    test('- Then it should remove the selected wallet', async () => {
      const { wrapper, queryClient } = mockTanstack();
      queryClient.setQueryData([keys.WALLETKEY, stubWallet.id], stubWallet);
      mockPut.mockReturnValueOnce({});

      const { result } = renderHook(() => useDeleteWallet(stubWallet.id), { wrapper });
      act(() => result.current.mutate());

      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
      expect(queryClient.getQueryData([keys.WALLETKEY, stubWallet.id])).toBeNull();
    });
  });
});
