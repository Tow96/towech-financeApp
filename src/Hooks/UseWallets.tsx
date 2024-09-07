/** UseWallets.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Reducer for all the changes that the wallets can receive
 */
import React, { useReducer } from 'react';

// Models
import { Objects } from '../models';

export interface WalletAction {
  type: 'SET' | 'ADD' | 'EDIT' | 'DELETE' | 'UPDATE-AMOUNT';
  payload: {
    wallets: Objects.Wallet[];
  };
}

// Functions
const cleanAndSort = (input: Objects.Wallet[]): Objects.Wallet[] => {
  // Gets the main wallets and sorts them
  let mainWallets: Objects.Wallet[] = [];
  input.map((x) => {
    if (x.parent_id === undefined || x.parent_id === null) mainWallets.push(x);
  });
  mainWallets = mainWallets.sort((a, b) => {
    if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
    if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
    return 0;
  });

  let output: Objects.Wallet[] = [];
  // Fetches the subwallets, sorts them and adds them
  mainWallets.map((mW) => {
    // Gets the subwallets for the main wallet
    let subWallets = input.filter((x) => {
      return x.parent_id === mW._id;
    });
    subWallets = subWallets.sort((a, b) => {
      if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
      if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
      return 0;
    });

    output = [...output, mW, ...subWallets];
  });

  return output;
};

// Reducer function, controls the dispatch commands
const reducer = (state: Objects.Wallet[], action: WalletAction): Objects.Wallet[] => {
  let item: Objects.Wallet[];

  switch (action.type.toUpperCase().trim()) {
    case 'SET':
      item = cleanAndSort(action.payload.wallets);
      return item;
    case 'ADD':
      item = [...state];

      // only adds the wallets that are not already in the state
      action.payload.wallets.map((wallet) => {
        // If the added wallet is a subwallet, it also gets added to it's parent
        if (wallet.parent_id !== null && wallet.parent_id !== undefined) {
          // Gets the index of the parent wallet and adds the wallet if unexistent
          const parentIndex = state.findIndex((x) => x._id === wallet.parent_id);

          // Only adds if the parent wallet exists
          if (parentIndex !== -1) {
            // Gets the missing wallet and only adds it if not already in the wallet
            let index = state[parentIndex].child_id?.findIndex((x) => x._id === wallet._id);
            if (index === undefined) index = -1;

            if (index === -1) state[parentIndex].child_id?.push(wallet);
          }
        }

        // Adds the new wallet to the list
        const index = state.findIndex((x) => x._id === wallet._id);
        if (index === -1) state.push(wallet);
      });

      return cleanAndSort(item);
    case 'EDIT':
      item = [...state];

      // only changes the wallets that are already in the state
      action.payload.wallets.map((wallet) => {
        // If the payload wallet is a subwallet the parent wallet also gets edited
        if (wallet.parent_id !== null && wallet.parent_id !== undefined) {
          // Gets the index of the parent wallet and adds the wallet if unexistent
          const parentIndex = state.findIndex((x) => x._id === wallet.parent_id);

          // Only edits the wallet if found
          if (parentIndex !== -1) {
            let index = state[parentIndex].child_id?.findIndex((x) => x._id === wallet._id);
            if (index === undefined) index = -1;

            if (index >= 0) state[parentIndex].child_id![index] = wallet;
          }
        }

        // Edits the wallet
        const index = state.findIndex((x) => x._id === wallet._id);
        if (index >= 0) state[index] = wallet;
      });

      return cleanAndSort(item);
    case 'DELETE':
      // First removes all main wallets that where given
      item = state.filter((wallet) => {
        const index = action.payload.wallets.findIndex((x) => x._id === wallet._id);
        return index < 0;
      });

      // Then removes any subwallet that was given
      action.payload.wallets.map((wallet) => {
        if (wallet.parent_id !== null && wallet.parent_id !== undefined) {
          // Gets the index of the parent wallet and adds the wallet if unexistent
          const parentIndex = state.findIndex((x) => x._id === wallet.parent_id);

          // Only removes the wallet if found
          if (parentIndex !== -1) {
            item[parentIndex].child_id = item[parentIndex].child_id?.filter((x) => {
              x._id === wallet._id;
            });
          }
        }
      });

      return item;
    case 'UPDATE-AMOUNT':
      item = [...state];

      // Goes through every wallet and sets the new amount value
      action.payload.wallets.map((wallet) => {
        const index = state.findIndex((x) => x._id === wallet._id);
        if (index >= 0) {
          item[index].money = wallet.money;
          item[index].child_id = wallet.child_id;
        }
      });
      return state;
    default:
      return state;
  }
};

/** useWallets
 * Reducer that stores the user wallets
 *
 * @param {Objects.Wallet[]} initial initial state of the wallets
 *
 * @returns {Objects.Wallet[]} Wallets
 * @returns {React.Dispatch<WalletAction>} The function to dispatch actions
 */
const useWallets = (initial?: Objects.Wallet[]): [Objects.Wallet[], React.Dispatch<WalletAction>] => {
  // The initial state is an empty array
  const initialState: Objects.Wallet[] = initial || [];

  // Reducer creation and returnal
  const [wallets, dispatch] = useReducer(reducer, initialState);
  return [wallets, dispatch];
};

export default useWallets;
