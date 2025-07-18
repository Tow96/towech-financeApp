import { useQuery } from '@tanstack/react-query';

import { WalletDto } from './dto';

export const WALLET_QUERY_KEY = 'wallets';

export const useWallets = () => {
  return useQuery<WalletDto[]>({
    queryKey: [WALLET_QUERY_KEY],
    queryFn: () => mockData,
  });
};

const mockData: WalletDto[] = [
  {
    id: 'this-is-an-id',
    archived: false,
    iconId: 8,
    money: 0,
    name: 'test wallet',
  },
  {
    id: 'another-id',
    archived: true,
    iconId: 12,
    money: 200.48,
    name: 'an-archived-wallet',
  },
  {
    id: 'agegiaegaeg',
    archived: false,
    iconId: 13,
    money: 1328913253.489,
    name: 'fat wallet',
  },
  {
    id: 'aieogiaegaegaegthj',
    archived: false,
    iconId: 2,
    money: -13535.281,
    name: 'debt-wallet',
  },
  {
    id: 'rotyohklvie',
    archived: false,
    iconId: 4,
    money: 22.342,
    name: 'wallet with a ridiculously long name to test text wrapping stuff since these things seem to be extremely complicated for no reason',
  },
];
