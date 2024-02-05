// Libraries ------------------------------------------------------------------
import { renderHook, waitFor } from '@testing-library/react';
import { mockTanstack, mockGet } from '@/utils/__mocks__/tanstack.mock';
// Tested Components ----------------------------------------------------------
import { useWallets, useWallet } from '../../WalletService';

// Stubs ----------------------------------------------------------------------
const stubWalletsResponse = [
  {
    _id: '626f409dabd58a5ec4583878',
    user_id: 'ffffffffffffffffffffffff',
    icon_id: 35,
    parent_id: null,
    child_id: [
      {
        _id: '627da8976d1a2310456850a6',
        user_id: 'ffffffffffffffffffffffff',
        icon_id: 34,
        parent_id: '626f409dabd58a5ec4583878',
        child_id: [],
        name: 'SubWallet A',
        currency: 'MXN',
        money: -10000,
        createdAt: '2024-01-22T00:00:00.000Z',
      },
      {
        _id: '62844cadef0b60e4b41fef17',
        user_id: 'ffffffffffffffffffffffff',
        icon_id: 28,
        parent_id: '626f409dabd58a5ec4583878',
        child_id: [],
        name: 'SubwalletB',
        currency: 'MXN',
        money: 0,
        createdAt: '2024-01-22T00:00:00.000Z',
      },
    ],
    name: 'Wallet',
    currency: 'MXN',
    money: 1000000,
    createdAt: '2024-01-22T00:00:00.000Z',
  },
  {
    _id: '626f40a7abd58a5ec703087c',
    user_id: 'ffffffffffffffffffffffff',
    icon_id: 6,
    parent_id: null,
    child_id: [],
    name: 'Another Wallet',
    currency: 'MXN',
    money: 92990,
    createdAt: '2024-01-22T00:00:00.000Z',
    __v: 0,
  },
  {
    _id: '627da8976d1a2310456850a6',
    user_id: 'ffffffffffffffffffffffff',
    icon_id: 34,
    parent_id: '626f409dabd58a5ec4583878',
    child_id: [],
    name: 'SubWallet A',
    currency: 'MXN',
    money: -10000,
    createdAt: '2024-01-22T00:00:00.000Z',
  },
  {
    _id: '62844cadef0b60e4b41fef17',
    user_id: 'ffffffffffffffffffffffff',
    icon_id: 28,
    parent_id: '626f409dabd58a5ec4583878',
    child_id: [],
    name: 'SubwalletB',
    currency: 'MXN',
    money: 0,
    createdAt: '2024-01-22T00:00:00.000Z',
  },
];
const stubDetailedWallet = {
  _id: '62844cadef0b60e4b41fef17',
  user_id: 'ffffffffffffffffffffffff',
  icon_id: 28,
  parent_id: '626f409dabd58a5ec4583878',
  child_id: [],
  name: 'SubwalletB',
  currency: 'MXN',
  money: 0,
  createdAt: '2024-01-22T00:00:00.000Z',
};

// Tests ----------------------------------------------------------------------
describe('WalletService', () => {
  describe('Query All', () => {
    it('Should obtain the wallets of the given user if the call is successful', async () => {
      const { wrapper } = mockTanstack();
      mockGet.mockImplementationOnce(() => stubWalletsResponse);

      const { result } = renderHook(() => useWallets(), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

      expect(mockGet).toHaveBeenCalledWith('/wallets', 'token');
      expect(result.current.data).toEqual(stubWalletsResponse.slice(0, 2));
    });
    it('Should be undefined if call is unsuccessful', async () => {
      const { wrapper } = mockTanstack();
      mockGet.mockImplementationOnce(() => {
        throw {};
      });

      const { result } = renderHook(() => useWallets(), { wrapper });
      await waitFor(() => expect(result.current.isError).toBeTruthy());

      expect(result.current.data).toBeUndefined();
    });
  });
  describe('Query Detail', () => {
    it('Should obtain the wallet if the call is successful', async () => {
      const { wrapper } = mockTanstack();
      mockGet.mockImplementationOnce(() => stubDetailedWallet);

      const { result } = renderHook(() => useWallet(stubDetailedWallet._id), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

      expect(mockGet).toHaveBeenCalledWith(`/wallets/${stubDetailedWallet._id}`, 'token');
      expect(result.current.data).toEqual(stubDetailedWallet);
    });
    it('Should be undefined if call is unsuccessful', async () => {
      const { wrapper } = mockTanstack();
      mockGet.mockImplementationOnce(() => {
        throw {};
      });

      const { result } = renderHook(() => useWallet(stubDetailedWallet._id), { wrapper });
      await waitFor(() => expect(result.current.isError).toBeTruthy());

      expect(result.current.data).toBeUndefined();
    });
  });
});
