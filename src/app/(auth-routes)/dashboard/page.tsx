/** dashboard/page.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Dashboard Page, will display transactions
 */
/* eslint-disable max-nested-callbacks */
'use client';
import { useContext, useState, useEffect } from 'react';

import { MainStore, TransactionPageStore } from '@/libs/legacyStuff/Hooks/ContextStore';
import { useAuth } from '@/libs/feature-authentication/UserService';
import TransactionService from '@/libs/legacyStuff/services/TransactionService';
import CategoryService from '@/libs/legacyStuff/services/CategoryService';
import useTransactions from '@/libs/legacyStuff/Hooks/UseTransactions';
import { useSearchParams } from 'next/navigation';
import { ParseDataMonth } from '@/libs/legacyStuff/utils/ParseDataMonth';
import { Button } from '@/components/button';
import WalletSelector from '@/libs/legacyStuff/Transactions/WalletSelector';
import '../../../libs/legacyStuff/Transactions/Transactions.css';
import EmptyTransactions from '@/libs/legacyStuff/Transactions/EmptyTransactions';
import DataMonthSelector from '@/libs/legacyStuff/Transactions/DataMonthSelector';
import WalletTotals from '@/libs/legacyStuff/Transactions/WalletTotals';
import TransactionForm from '@/libs/legacyStuff/Transactions/TransactionForm';
import TransactionViewer from '@/libs/legacyStuff/Transactions/TransactionViewer';

const DashboardPage = (): JSX.Element => {
  const { wallets, dispatchWallets, dispatchCategories } = useContext(MainStore);
  const { data: user } = useAuth();
  const params = useSearchParams();

  const transactionService = new TransactionService({ token: user?.token || '' }, () => {});
  const categoryService = new CategoryService({ token: user?.token || '' }, () => {});

  const [loaded, setLoaded] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [transactionState, dispatchTransactionState] = useTransactions({
    selectedWallet: { _id: params.get('wallet') || '-1' },
    dataMonth: ParseDataMonth(params.get('month')),
    report: { earnings: 0, expenses: 0 },
    transactions: [],
  });

  const [addModal, setAddModal] = useState(false);

  // Main API call
  useEffect(() => {
    if (user?.token) {
      // Gets all the wallets of the client
      transactionService
        .getWallets()
        .then(res => {
          // Sets the available wallets, the transactions are fetched later
          dispatchWallets({ type: 'SET', payload: { wallets: res.data } });

          // Also generates and sets the selectedWallet to contain the children
          const firstSelectedWallet = res.data.find(
            (x: any) => x._id === (params.get('wallet') || '-1')
          );

          dispatchTransactionState({
            type: 'SELECT-WALLET',
            payload: { selectedWallet: firstSelectedWallet || { _id: '-1' } },
          });
        })
        .catch(() => {
          // console.log(err.response);
        })
        .finally(() => setLoaded(true));

      // Gets all the categories
      categoryService.getCategories().then(catRes => {
        dispatchCategories({
          type: 'UPDATE',
          payload: catRes.data,
        });
      });
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!loaded) return;
    loadTransactions(transactionState.selectedWallet._id, transactionState.dataMonth);
  }, [transactionState.selectedWallet, transactionState.dataMonth]); // eslint-disable-line

  const loadTransactions = async (walletId: string, dataMonth: string): Promise<void> => {
    const res = await transactionService.getWalletTransactions(
      walletId,
      dataMonth,
      setLoadingTransactions
    );
    dispatchTransactionState({
      type: 'SET',
      payload: {
        transactions: res.data,
      },
    });
  };

  return (
    <main>
      <TransactionPageStore.Provider value={{ transactionState, dispatchTransactionState }}>
        <div>
          <WalletSelector />{' '}
          <Button className="Transactions__AddTop" onClick={() => setAddModal(true)}>
            New Transaction
          </Button>
        </div>
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
                      {/* <Loading className="Transactions__Spinner" /> */}
                    </div>
                  )}
                </div>
                {/*Add wallet button - mobile only*/}
                {/* <Button accent round className="Transactions__AddFloat" onClick={() => setAddModal(true)}>
                  <FaIcons.FaPlus />
                </Button> */}
                {/*Add wallet form*/}
                <TransactionForm state={addModal} setState={setAddModal} />
              </>
            )}
          </div>
        ) : (
          <></>
        )}
      </TransactionPageStore.Provider>
    </main>
  );
};

export default DashboardPage;
