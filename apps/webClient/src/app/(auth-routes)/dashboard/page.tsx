'use client';
import { ReactElement, useContext, useEffect, useState } from 'react';
// Hooks
import { useSearchParams } from 'next/navigation';
import { MainStore, TransactionPageStore } from '../../../Legacy/Hooks/ContextStore';
import { useAuthentication } from '@financeapp/frontend-authentication';
import useTransactions from '../../../Legacy/Hooks/UseTransactions';
// Services
import TransactionService from '../../../Legacy/Services/TransactionService';
import CategoryService from '../../../Legacy/Services/CategoryService';
// Components
import Button from '../../../Legacy/Components/Button';
import WalletSelector from '../../../Legacy/Components/Transactions/WalletSelector';
import EmptyTransactions from '../../../Legacy/Components/Transactions/EmptyTransactions';
import DataMonthSelector from '../../../Legacy/Components/Transactions/DataMonthSelector';
import WalletTotals from '../../../Legacy/Components/Transactions/WalletTotals';
import TransactionForm from '../../../Legacy/Components/Transactions/TransactionForm';
import TransactionViewer from '../../../Legacy/Components/Transactions/TransactionViewer';
// Utils
import { ParseDataMonth } from '../../../Legacy/Utils/ParseDataMonth';
// Styles
import '../../../Legacy/Components/Transactions/Transactions.css';

const DashboardPage = (): ReactElement => {
  const { wallets, dispatchWallets, dispatchCategories } = useContext(MainStore);
  const { data: user } = useAuthentication();
  const params = useSearchParams();

  const transactionService = new TransactionService(user?.token || '', () => {}); // eslint-disable-line @typescript-eslint/no-empty-function
  const categoryService = new CategoryService(user?.token || '', () => {}); // eslint-disable-line @typescript-eslint/no-empty-function

  const [loaded, setLoaded] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [transactionState, dispatchTransactionState] = useTransactions({
    selectedWallet: {
      _id: params.get('wallet') || '-1',
      user_id: '',
      icon_id: -1,
      name: '',
      createdAt: new Date(0),
      child_id: [],
      money: 0,
      parent_id: '',
      currency: '',
    },
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
        .then((res) => {
          // Sets the available wallets, the transactions are fetched later
          dispatchWallets({ type: 'SET', payload: { wallets: res.data } });

          // Also generates and sets the selectedWallet to contain the children
          const firstSelectedWallet = res.data.find(
            (x: any) => x._id === (params.get('wallet') || '-1')
          );

          dispatchTransactionState({
            type: 'SELECT-WALLET',
            payload: {
              selectedWallet: firstSelectedWallet || {
                _id: '-1',
                user_id: '',
                icon_id: 0,
                currency: '',
                money: 0,
                parent_id: '',
                child_id: [],
                name: '',
                createdAt: new Date(0),
              },
            },
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

  useEffect(() => {
    if (!loaded) return;
    loadTransactions(transactionState.selectedWallet._id, transactionState.dataMonth);
  }, [transactionState.selectedWallet, transactionState.dataMonth]);

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
          <WalletSelector /> <Button onClick={() => setAddModal(true)}>New Transaction</Button>
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
