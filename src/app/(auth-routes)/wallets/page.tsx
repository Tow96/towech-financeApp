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
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Legacy ---------------------------------------------------------------------
import '../../../libs/legacyStuff/wallets/Wallets.css';
import { MainStore } from '@/libs/legacyStuff/Hooks/ContextStore';
import TransactionService from '@/libs/legacyStuff/services/TransactionService';
import WalletForm from '@/libs/legacyStuff/wallets/WalletForm';
import NoWalletsCard from '@/libs/legacyStuff/wallets/NoWalletsCard';
import { useWalletIds, useWallets } from '@/libs/feature-transactions/TransactionService';
import { WalletCard } from '@/libs/feature-transactions/WalletCard';

// Component ------------------------------------------------------------------
const WalletsPage = (): JSX.Element => {
  const { data: walletIds } = useWalletIds();
  const wallets = useWallets(walletIds);
  // const { wallets, dispatchWallets } = useContext(MainStore);

  // const visibleWallets = wallets.filter(x => {
  //   return x.parent_id === undefined || x.parent_id === null;
  // });

  // Starts the services
  // const transactionService = new TransactionService({ token: user?.token || '' }, () => {});

  return (
    <main>
      <ul>
        {wallets.map((w, i) => (
          <WalletCard key={i} wallet={w.data}></WalletCard>
        ))}
      </ul>
      {/* <div className="Wallets"> */}
      {/* {JSON.stringify(wallets[0].data)} */}
      {/* Add Wallet button (mobile) */}
      {/* <Button className="Wallets__AddFloat" onClick={() => setModal(true)}>
          <FontAwesomeIcon icon={'plus'} />
        </Button> */}

      {/*Add/edit wallet Form*/}
      {/* <WalletForm state={modal} set={setModal} /> */}

      {/*Lists all the wallets, if none available, returns a "No Wallets" text*/}
      {/*loaded ? (
          visibleWallets.length == 0 ? (
            <NoWalletsCard />
          ) : (
            <div className="Wallets__Container">
              <div className="Wallets__Container__Section">
                {/*visibleWallets.map(wallet => (
                  <WalletCard key={wallet._id} wallet={wallet} />
                ))* /}
              </div>
            </div>
          )
        ) : (
          <div />
        )*/}
      {/* </div> */}
    </main>
  );
};

export default WalletsPage;
