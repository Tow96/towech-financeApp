/** wallets/page.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Main wallets page
 */
'use client';
// Hooks ----------------------------------------------------------------------
import { useContext, useEffect, useState } from 'react';
// import { useWallets } from '@/libs/feature-wallets/WalletService';
// Used components ------------------------------------------------------------
import { Button } from '@/components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Legacy ---------------------------------------------------------------------
import '../../../libs/legacyStuff/wallets/Wallets.css';
import { MainStore } from '@/libs/legacyStuff/Hooks/ContextStore';
import { useAuth } from '@/libs/feature-authentication/UserService';
import TransactionService from '@/libs/legacyStuff/services/TransactionService';
import WalletForm from '@/libs/legacyStuff/wallets/WalletForm';
import NoWalletsCard from '@/libs/legacyStuff/wallets/NoWalletsCard';
import WalletCard from '@/libs/legacyStuff/wallets/WalletCard';

// Component ------------------------------------------------------------------
/* eslint-disable  max-nested-callbacks */
const WalletsPage = (): JSX.Element => {
  // const { data: wallets } = useWallets();
  const { wallets, dispatchWallets } = useContext(MainStore);
  const { data: user } = useAuth();

  const visibleWallets = wallets.filter(x => {
    return x.parent_id === undefined || x.parent_id === null;
  });

  // Starts the services
  const transactionService = new TransactionService({ token: user?.token || '' }, () => {});

  // Hooks
  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState(false);

  // Main API call
  useEffect(() => {
    transactionService
      .getWallets()
      .then(res => {
        dispatchWallets({ type: 'SET', payload: { wallets: res.data } });
        setLoaded(true);
      })
      .catch(() => {
        // console.log(err.response);
        setLoaded(true);
      });
  }, []);

  return (
    <main>
      <div className="Wallets__Header">
        <div>
          <h1>Wallets</h1>
        </div>
        <Button className="Wallets__AddTop" onClick={() => setModal(true)}>
          Add Wallet
        </Button>
      </div>
      <div className="Wallets">
        {/* Add Wallet button (mobile) */}
        {/* <Button className="Wallets__AddFloat" onClick={() => setModal(true)}>
          <FontAwesomeIcon icon={'plus'} />
        </Button> */}

        {/*Add/edit wallet Form*/}
        <WalletForm state={modal} set={setModal} />

        {/*Lists all the wallets, if none available, returns a "No Wallets" text*/}
        {loaded ? (
          visibleWallets.length == 0 ? (
            <NoWalletsCard />
          ) : (
            <div className="Wallets__Container">
              <div className="Wallets__Container__Section">
                {visibleWallets.map(wallet => (
                  <WalletCard key={wallet._id} wallet={wallet} />
                ))}
              </div>
            </div>
          )
        ) : (
          <div />
        )}
      </div>
    </main>
  );
};

export default WalletsPage;
