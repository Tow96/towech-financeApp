/** UseTransactions.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Reducer for all the changes that the transactions can receive
 */
import React, { useReducer } from 'react';

// Models
import { Objects } from '../models';

// Utilities
import { ParseDataMonth, DateInsideDataMonth } from '../Utils/ParseDataMonth';

export interface FrontendTransaction extends Objects.Transaction {
  from_wallet?: string;
  to_wallet?: string;
}

export interface TransactionState {
  selectedWallet: Objects.Wallet;
  dataMonth: string;
  report: { earnings: number; expenses: number };
  transactions: FrontendTransaction[];
}

export interface TransAction {
  type: 'SELECT-WALLET' | 'SELECT-DATAMONTH' | 'SET' | 'ADD' | 'EDIT' | 'DELETE';
  payload: {
    dataMonth?: string;
    selectedWallet?: Objects.Wallet;
    transactions?: Objects.Transaction[];
    consolidateChildren?: boolean;
  };
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
const cleanAndSort = (
  input: Objects.Transaction[],
  selectedWallet: Objects.Wallet,
  dataMonth: string
): FrontendTransaction[] => {
  // Removes transactions outside the datamonth and wallet/subwallets
  const cleaned = [] as FrontendTransaction[];
  input.map((x) => {
    const validWallets = [selectedWallet._id];
    selectedWallet.child_id?.map((x) => validWallets.push(x._id));

    /** First removes the transactions following the parameters
     * - The transaction is part of the selected wallet or "Total" is selected
     * - the transactions can also be inside the child wallets
     * - The transaction is inside the selected dataMonth
     */
    if (
      (selectedWallet._id === '-1' || validWallets.includes(x.wallet_id)) &&
      DateInsideDataMonth(x.transactionDate, dataMonth)
    ) {
      cleaned.push(x);
    }
  });

  // Gets the index of all transfers that are both contained in the array
  const transferClean: FrontendTransaction[] = [];
  for (let i = 0; i < cleaned.length; i++) {
    // transferClean.push(cleaned[i]); continue; // Skip this and pass all transactions

    // If the transaction is not part of a transfer, gets passed without other checks
    if (cleaned[i].transfer_id === undefined || cleaned[i].transfer_id === null) {
      transferClean.push(cleaned[i]);
      continue;
    }

    // All transactions beyond this point are transactions ---

    // Checks if the partner transactions was already added
    const transferred = transferClean.find(
      (x) => x._id === cleaned[i]._id || x.transfer_id === cleaned[i]._id
    );

    // Either adds or pushes the transaction along with its from-to
    if (transferred) {
      // If both transactions are present, it automatically gets excluded from the report
      transferred.excludeFromReport = true;
      cleaned[i].category.type === 'Expense'
        ? (transferred.from_wallet = cleaned[i].wallet_id)
        : (transferred.to_wallet = cleaned[i].wallet_id);
    } else {
      cleaned[i].category.type === 'Expense'
        ? (cleaned[i].from_wallet = cleaned[i].wallet_id)
        : (cleaned[i].to_wallet = cleaned[i].wallet_id);

      transferClean.push(cleaned[i]);
    }
  }

  const output = transferClean.sort((a, b) => {
    if (a.transactionDate > b.transactionDate) return -1;
    if (a.transactionDate < b.transactionDate) return 1;

    // If transaction date is the same, sorts them by creation date
    if (a.createdAt > b.createdAt) return -1;
    if (a.createdAt < b.createdAt) return 1;

    return 0;
  });

  return output;
};

// Reads the transactions and separates the income and expenses as well as the total in the header
const calculateReport = (
  input: Objects.Transaction[],
  selectedWallet: Objects.Wallet
): { earnings: number; expenses: number } => {
  let earnings = 0;
  let expenses = 0;

  input.map((x) => {
    if (!x.excludeFromReport && !(x.transfer_id && selectedWallet._id === '-1')) {
      if (x.category.type === 'Income') {
        earnings += x.amount;
      } else {
        expenses += x.amount;
      }
    }
  });
  return { earnings, expenses };
};

// Reducer function, controls the dispatch commands
const reducer = (state: TransactionState, action: TransAction): TransactionState => {
  let item: TransactionState;

  switch (action.type.toUpperCase().trim()) {
    case 'SELECT-WALLET':
      item = { ...state };
      item.selectedWallet = action.payload.selectedWallet || ({ _id: '-1' } as Objects.Wallet);

      return item;
    case 'SELECT-DATAMONTH':
      item = { ...state };
      item.dataMonth = ParseDataMonth(action.payload.dataMonth || state.dataMonth);

      return item;
    case 'SET':
      item = {
        dataMonth: action.payload.dataMonth || state.dataMonth,
        selectedWallet: action.payload.selectedWallet || state.selectedWallet,
        transactions: cleanAndSort(
          action.payload.transactions || state.transactions,
          state.selectedWallet,
          ParseDataMonth(state.dataMonth)
        ),
        report: { earnings: 0, expenses: 0 },
      };

      item.report = calculateReport(item.transactions, item.selectedWallet);
      return item;
    case 'ADD':
      item = { ...state };

      // only adds the transactions that are not already in the state
      action.payload.transactions?.map((transaction: Objects.Transaction) => {
        const index = state.transactions.findIndex((x) => x._id === transaction._id);
        if (index === -1) {
          item.transactions.push(transaction);
        }
      });

      item.transactions = cleanAndSort(
        item.transactions,
        state.selectedWallet,
        ParseDataMonth(state.dataMonth)
      );
      item.report = calculateReport(item.transactions, item.selectedWallet);

      return item;
    case 'EDIT':
      item = { ...state };

      action.payload.transactions?.map((transaction: Objects.Transaction) => {
        // only changes the transactions that are in the state
        const index = state.transactions.findIndex((x) => x._id === transaction._id);
        if (index >= 0) {
          item.transactions[index] = transaction;
        }
        // If a transfer was edited, then the partner transaction also was updated, so it also gets added
        else {
          const transferIndex = state.transactions.findIndex(
            (x) => x.transfer_id === transaction._id
          );
          if (transferIndex >= 0) {
            item.transactions.push(transaction);
          }
        }
      });

      item.transactions = cleanAndSort(
        item.transactions,
        state.selectedWallet,
        ParseDataMonth(state.dataMonth)
      );
      item.report = calculateReport(item.transactions, item.selectedWallet);
      return item;
    case 'DELETE':
      item = { ...state };

      // Filters the array
      item.transactions = state.transactions.filter((transaction) => {
        let index = action.payload.transactions?.findIndex(
          (x: Objects.Transaction) => x._id === transaction._id
        );
        if (index === undefined) index = -1;

        return index < 0;
      });

      item.report = calculateReport(item.transactions, item.selectedWallet);
      return item;
    default:
      return state;
  }
};

const useTransactions = (
  initial?: TransactionState
): [TransactionState, React.Dispatch<TransAction>] => {
  // The initial state is an empty array
  const initialState: TransactionState = initial || {
    selectedWallet: { _id: '-1' } as Objects.Wallet,
    dataMonth: ParseDataMonth('-1'),
    report: { earnings: 0, expenses: 0 },
    transactions: [],
  };

  // Reducer creation and returnal
  const [transactions, dispatch] = useReducer(reducer, initialState);
  return [transactions, dispatch];
};

export default useTransactions;
