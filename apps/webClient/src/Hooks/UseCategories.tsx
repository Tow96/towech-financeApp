/** UseCategories.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Hook that holds all the categories of a user, meant to be used in conjunction with
 * a store to create a cache
 */
import React, { useReducer } from 'react';

// Models
import { Objects } from '../models';

export interface CategoryState {
  Income: Objects.Category[];
  Expense: Objects.Category[];
  Archived: Objects.Category[];
}

export interface CategoryAction {
  type: 'SET' | 'UPDATE';
  payload: {
    Income: Objects.Category[];
    Expense: Objects.Category[];
    Archived: Objects.Category[];
  };
}

// Functions
const cleanAndSort = (input: Objects.Category[]): Objects.Category[] => {
  // Gets the main wallets and sorts them
  let mainCategories: Objects.Category[] = [];
  input.map((x) => {
    if (x.parent_id === '-1') mainCategories.push(x);
  });
  mainCategories = mainCategories.sort((a, b) => {
    if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
    if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
    return 0;
  });

  let output: Objects.Category[] = [];
  // Fetches the subwallets, sorts them and adds them
  mainCategories.map((mC) => {
    // Gets the subwallets for the main wallet
    let subCategories = input.filter((x) => {
      return x.parent_id === mC._id;
    });
    subCategories = subCategories.sort((a, b) => {
      if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
      if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
      return 0;
    });

    output = [...output, mC, ...subCategories];
  });

  return output;
};

// Reducer function, controls the dispatch commands
const reducer = (state: CategoryState, action: CategoryAction): CategoryState => {
  let item: CategoryState;

  switch (action.type.toUpperCase().trim()) {
    case 'SET':
      item = {
        Income: cleanAndSort(action.payload.Income),
        Expense: cleanAndSort(action.payload.Expense),
        Archived: cleanAndSort(action.payload.Archived),
      };
      return item;
    case 'UPDATE':
      item = { Income: state.Income, Expense: state.Expense, Archived: cleanAndSort(action.payload.Archived) };

      action.payload.Income.map((cat) => {
        const index = state.Income.findIndex((x) => x._id === cat._id);
        if (index === -1) state.Income.push(cat);
      });

      action.payload.Expense.map((cat) => {
        const index = state.Expense.findIndex((x) => x._id === cat._id);
        if (index === -1) state.Expense.push(cat);
      });

      item.Income = cleanAndSort(item.Income);
      item.Expense = cleanAndSort(item.Expense);

      return item;
    default:
      return state;
  }
};

/** useCategories
 * Reducer that stores the user categories
 *
 * @param {CategoryState} initial initial state of the categories
 *
 * @returns {CategoryState} categories
 * @returns {React.Dispatch<categoryAction>} The function to dispatch actions
 *
 */
const useCategories = (initial?: CategoryState): [CategoryState, React.Dispatch<CategoryAction>] => {
  // The initial state is an empty array
  const initialState: CategoryState = initial || { Income: [], Expense: [], Archived: [] };

  // Reducer creation and returnal
  const [categories, dispatch] = useReducer(reducer, initialState);
  return [categories, dispatch];
};

export default useCategories;
