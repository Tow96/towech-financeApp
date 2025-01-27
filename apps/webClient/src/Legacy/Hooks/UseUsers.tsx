/** UseUsers.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Reducer for all the changes that the users can receive
 */
import React, { useReducer } from 'react';
// Models
import { Objects } from '../models';

export interface UserAction {
  type: 'SET' | 'ADD' | 'EDIT' | 'DELETE';
  payload: Objects.User.BaseUser[];
}

/** useWallets
 * Reducer that stores the user transactions
 *
 * @param {Objects.TransactionState} initial initial state of the transactions
 *
 * @returns {Objects.TransactionState} Wallets
 * @returns {React.Dispatch<TransAction>} The function to dispatch actions
 */
// Functions
const cleanAndSort = (input: Objects.User.BaseUser[]): Objects.User.BaseUser[] => {
  // Removes transactions outside the datamonth and wallet/subwallets
  const cleaned = [] as Objects.User.BaseUser[];
  input.forEach((x) => {
    cleaned.push(x);
  });

  const output = cleaned.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;

    // If the names are the same, sorts them by email
    if (a.username < b.username) return -1;
    if (a.username > b.username) return 1;

    return 0;
  });

  return output;
};

// Reads the transactions and separates the income and expenses as well as the total in the header

// Reducer function, controls the dispatch commands
const reducer = (state: Objects.User.BaseUser[], action: UserAction): Objects.User.BaseUser[] => {
  let item: Objects.User.BaseUser[];

  switch (action.type.toUpperCase().trim()) {
    case 'SET':
      item = cleanAndSort(action.payload);
      return item;
    case 'ADD':
      item = [...state];

      // only adds the users that are not already in the state
      action.payload.forEach((user: Objects.User.BaseUser) => {
        const index = state.findIndex((x) => x._id === user._id);
        if (index === -1) {
          item.push(user);
        }
      });

      item = cleanAndSort(item);

      return item;
    case 'EDIT':
      item = [...state];

      action.payload?.forEach((user: Objects.User.BaseUser) => {
        // only changes the users that are in the state
        const index = state.findIndex((x) => x._id === user._id);
        if (index >= 0) {
          item[index] = user;
        }
      });

      item = cleanAndSort(item);

      return item;
    case 'DELETE':
      item = [...state];

      // Filters the array
      item = state.filter((user) => {
        let index = action.payload?.findIndex((x: Objects.User.BaseUser) => x._id === user._id);
        if (index === undefined) index = -1;

        return index < 0;
      });

      return item;
    default:
      return state;
  }
};

const UseUsers = (
  initial?: Objects.User.BaseUser[]
): [Objects.User.BaseUser[], React.Dispatch<UserAction>] => {
  // The initial state is an empty array
  const initialState: Objects.User.BaseUser[] = initial || [];

  // Reducer creation and returnal
  const [transactions, dispatch] = useReducer(reducer, initialState);
  return [transactions, dispatch];
};

export default UseUsers;
