/** Transactions.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Transactions Page for the App
 */
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';

// hooks
import { MainStore, TransactionPageStore } from '../../Hooks/ContextStore';
import useTransactions from '../../Hooks/UseTransactions';

// Components
import Button from '../../Components/Button';
import Page from '../../Components/Page';
import DataMonthSelector from './DataMonthSelector';
import TransactionViewer from './TransactionViewer';
import WalletTotals from './WalletTotals';
import TransactionForm from './TransactionForm';
import Loading from '../../Components/Loading';
import WalletSelector from './WalletSelector';
import EmptyTransactions from './EmptyTransactions';

// Models
import { Objects } from '../../models';

// Services
import TransactionService from '../../Services/TransactionService';
import CategoryService from '../../Services/CategoryService';

// Utilities
import GetParameters from '../../Utils/GetParameters';
import { ParseDataMonth } from '../../Utils/ParseDataMonth';

// Styles
import './Transactions.css';

const Transactions = (): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken, wallets, dispatchWallets, dispatchCategories } = useContext(MainStore);
  const location = useLocation();

  // Starts the services
  const transactionService = new TransactionService(authToken, dispatchAuthToken);
  const categoryService = new CategoryService(authToken, dispatchAuthToken);

  // Hooks
  const [loaded, setLoaded] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [transactionState, dispatchTransactionState] = useTransactions({
    selectedWallet: { _id: GetParameters(location.search, 'wallet') || '-1' } as Objects.Wallet,
    dataMonth: ParseDataMonth(GetParameters(location.search, 'month')),
    report: { earnings: 0, expenses: 0 },
    transactions: [],
  });

  const [addModal, setAddModal] = useState(false);

  // Main API call
  useEffect(() => {
    if (authToken.token) {
      // Gets all the wallets of the client
      transactionService
        .getWallets()
        .then((res) => {
          // Sets the available wallets, the transactions are fetched later
          dispatchWallets({ type: 'SET', payload: { wallets: res.data } });

          // Also generates and sets the selectedWallet to contain the children
          const firstSelectedWallet = res.data.find(
            (x) => x._id === (GetParameters(location.search, 'wallet') || '-1'),
          );

          dispatchTransactionState({
            type: 'SELECT-WALLET',
            payload: { selectedWallet: firstSelectedWallet || ({ _id: '-1' } as Objects.Wallet) },
          });
        })
        .catch(() => {
          // console.log(err.response);
        })
        .finally(() => setLoaded(true));

      // Gets all the categories
      categoryService.getCategories().then((catRes) => {
        dispatchCategories({
          type: 'UPDATE',
          payload: catRes.data,
        });
      });
    }
  }, []);

  // Code that is run everytime the selectedWalletId changes
  useEffect(() => {
    if (!loaded) return;
    loadTransactions(transactionState.selectedWallet._id, transactionState.dataMonth);
  }, [transactionState.selectedWallet, transactionState.dataMonth]);

  // Gets the transactions from the API of the selected wallet
  const loadTransactions = async (walletId: string, dataMonth: string): Promise<void> => {
    const res = await transactionService.getWalletTransactions(walletId, dataMonth, setLoadingTransactions);
    dispatchTransactionState({
      type: 'SET',
      payload: {
        transactions: res.data,
      },
    });
  };

  // Extracted HTML components
  const header =
    loaded && wallets.length > 0 ? (
      <>
        <WalletSelector />{' '}
        <Button accent className="Transactions__AddTop" onClick={() => setAddModal(true)}>
          New Transaction
        </Button>
      </>
    ) : (
      <></>
    );

  return (
    <TransactionPageStore.Provider value={{ transactionState, dispatchTransactionState }}>
      <Page loading={!loaded} header={header} selected="Transactions">
        {loaded ? (
          <div className="Transactions">
            {wallets.length == 0 ? (
              <EmptyTransactions.RedirectToWallets />
            ) : (
              <>
                {/* Main content */}
                <div className="Transactions__Content">
                  <DataMonthSelector />
                  <WalletTotals
                    totals={transactionState.report}
                    hidden={!(!loadingTransactions && transactionState.transactions.length > 0)}
                  />
                  <TransactionViewer hidden={loadingTransactions} />
                  {loadingTransactions && (
                    <div className="Transactions__Content__Loading">
                      <Loading className="Transactions__Spinner" />
                    </div>
                  )}
                </div>
                {/*Add wallet button - mobile only*/}
                <Button accent round className="Transactions__AddFloat" onClick={() => setAddModal(true)}>
                  <FaIcons.FaPlus />
                </Button>
                {/*Add wallet form*/}
                <TransactionForm state={addModal} setState={setAddModal} />
              </>
            )}
          </div>
        ) : (
          <></>
        )}
      </Page>
    </TransactionPageStore.Provider>
  );
};

export default Transactions;
