/** useToken.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Hook that holds a jwtToken state
 *
 * @param storageLocation Where in the browser storage the token is stored,
 *                        if not provided, does not uses the storage
 */
import React, { useReducer } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Objects } from '../models';

// Extension of the user interface that also has the token, is used for the useToken reducer
export interface TokenState extends Objects.User.BackendUser {
  token: string;
}

// Object that defines the elements of the action for the reducer
export interface TokenAction {
  type: string;
  payload: {
    token: string;
  };
}

// Retrieves the token from the browser storage, if not provided is null
// Converts the retrieved values into a tokenState object
const initialState: TokenState = {} as TokenState;

// Reducer function, controls the dispatch commands
function reducer(state: TokenState, action: TokenAction): TokenState {
  let item: TokenState;

  switch (action.type.toUpperCase()) {
    case 'LOGIN':
      item = jwtDecode(action.payload.token);
      item.token = action.payload.token;
      return item;
    case 'LOGOUT':
      return {} as TokenState;
    default:
      return state;
  }
}

/** useToken
 * Reducer that stores and manager the user token
 *
 * @param {string} storageLocation Key of the storage location of the token
 *
 * @returns {tokenState} state of the token
 * @returns {React.Dispatch<tokenAction>} The function to dispatch actions
 *
 */
const useToken = (): [TokenState, React.Dispatch<TokenAction>] => {
  // Creates the reducer
  const [token, dispatch] = useReducer(reducer, initialState);
  return [token, dispatch];
};

export default useToken;
//authToken
