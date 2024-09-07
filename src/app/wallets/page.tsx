/** Wallets.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Home Page for the App
 */
'use client';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as FaIcons from 'react-icons/fa';

// hooks
import { MainStore } from '../../Hooks/ContextStore';
// import WalletForm from './WalletForm';

// Components
import Button from '../../Components/Button';
import Page from '../../Components/Page';
import NoWalletsCard from 'src/Components/Wallets/NoWalletsCard';
import WalletCard from 'src/Components/Wallets/WalletCard';
import WalletForm from 'src/Components/Wallets/WalletForm';

// Services
import TransactionService from '../../Services/TransactionService';

// Styles
import './Wallets.css';
import './NoWalletsCard.css';
import './WalletCard.css';
import './WalletForm.css';

const Wallets = (): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken, wallets, dispatchWallets } = useContext(MainStore);
  const router = useRouter();
  if (!authToken.token) router.push('/?redirect=wallets');

  const visibleWallets = wallets.filter((x) => {
    return x.parent_id === undefined || x.parent_id === null;
  });

  // Starts the services
  const transactionService = new TransactionService(authToken, dispatchAuthToken);

  // Hooks
  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState(false);

  // Main API call
  useEffect(() => {
    transactionService
      .getWallets()
      .then((res) => {
        dispatchWallets({ type: 'SET', payload: { wallets: res.data } });
        setLoaded(true);
      })
      .catch(() => {
        // console.log(err.response);
        setLoaded(true);
      });
  }, []);

  const header = (
    <div className="Wallets__Header">
      <div>
        <h1>Wallets</h1>
      </div>
      <Button accent className="Wallets__AddTop" onClick={() => setModal(true)}>
        Add Wallet
      </Button>
    </div>
  );

  return (
    <Page loading={!loaded} selected="Wallets" header={header}>
      <div className="Wallets">
        {/* Add Wallet button (mobile) */}
        <Button accent round className="Wallets__AddFloat" onClick={() => setModal(true)}>
          <FaIcons.FaPlus />
        </Button>

        {/*Add/edit wallet Form*/}
        <WalletForm state={modal} set={setModal} />

        {/*Lists all the wallets, if none available, returns a "No Wallets" text*/}
        {loaded ? (
          visibleWallets.length == 0 ? (
            <NoWalletsCard />
          ) : (
            <div className="Wallets__Container">
              <div className="Wallets__Container__Section">
                {visibleWallets.map((wallet) => (
                  <WalletCard key={wallet._id} wallet={wallet} />
                ))}
              </div>
            </div>
          )
        ) : (
          <div />
        )}
      </div>
    </Page>
  );
};

export default Wallets;
