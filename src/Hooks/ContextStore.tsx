/** ContextStore.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Component that contains the Context items for the whole WebClient
 */
import React, { createContext } from 'react';

// Hooks
import { TokenAction, TokenState } from './UseToken';
import { CategoryAction, CategoryState } from './UseCategories';
import { WalletAction } from './UseWallets';
import { TransactionState, TransAction } from './UseTransactions';

// Models
import { Objects } from '../models';
import { UserAction } from './UseUsers';

// Context that holds the Authentication Token in order to make API Calls
export const MainStore = createContext({
  // Token
  authToken: {} as TokenState,
  dispatchAuthToken: (() => {
    /*empty*/
  }) as React.Dispatch<TokenAction>,

  // Wallets
  wallets: [] as Objects.Wallet[],
  dispatchWallets: (() => {
    /*empty*/
  }) as React.Dispatch<WalletAction>,

  // Categories
  categories: {} as CategoryState,
  dispatchCategories: (() => {
    /*empty*/
  }) as React.Dispatch<CategoryAction>,
});

export const TransactionPageStore = createContext({
  // transactions
  transactionState: {} as TransactionState,
  dispatchTransactionState: (() => {
    /*empty*/
  }) as React.Dispatch<TransAction>,
});

export const ManageUsersStore = createContext({
  // Users
  userState: {} as Objects.User.BaseUser[],
  dispatchUserState: (() => {
    /* empty */
  }) as React.Dispatch<UserAction>,
});
