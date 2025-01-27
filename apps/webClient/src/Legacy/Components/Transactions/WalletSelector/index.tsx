/** index.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Header that allows to change the selected wallet
 */
// Libraries
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';

// hooks
import { MainStore, TransactionPageStore } from '../../../Hooks/ContextStore';

// Models
import { Objects } from '../../../models';

// Components
import Modal from '../../Modal';
import { IdIcons } from '../../../Icons';

// Utils
import ParseMoneyAmount from '../../../Utils/ParseMoneyAmount';

// Styles
import './WalletSelector.css';

// Interfaces
interface WalletProps {
  onClick: (id?: Objects.Wallet) => void;
  wallet?: Objects.Wallet;
  total?: number;
}

const TransactionHeader = (): JSX.Element => {
  const { wallets } = useContext(MainStore);
  const { transactionState, dispatchTransactionState } = useContext(TransactionPageStore);
  const router = useRouter();

  // Hooks
  const [showModal, setModal] = useState(false);

  // Functions
  const selectWallet = (wallet?: Objects.Wallet) => {
    if ((wallet?._id || '-1') !== transactionState.selectedWallet._id) {
      router.push(`/home?wallet=${wallet?._id || '-1'}&month=${transactionState.dataMonth}`);

      dispatchTransactionState({ type: 'SELECT-WALLET', payload: { selectedWallet: wallet } });
    }
    setModal(false);
  };

  const getNameAndTotal = (
    wallets: Objects.Wallet[],
    selected: string
  ): { name: string; total: number; money: number; id: number } => {
    const output = {
      id: -1,
      name: 'Total',
      total: 0,
      money: 0,
    };

    for (let i = 0; i < wallets.length; i++) {
      if (wallets[i].parent_id === undefined || wallets[i].parent_id === null)
        output.total += wallets[i].money || 0;

      if (wallets[i]._id === selected) {
        output.name = wallets[i].name;
        output.money = wallets[i].money || 0;
        output.id = wallets[i].icon_id;
      }
    }

    if (transactionState.selectedWallet._id === '-1') output.money = output.total;

    return output;
  };

  // Variables
  const displayed = getNameAndTotal(wallets, transactionState.selectedWallet._id);

  return (
    <div className="Transactions__WalletSelector">
      {/* Header */}
      <div className="Transactions__WalletSelector__Main" onClick={() => setModal(true)}>
        <div className="Transactions__WalletSelector__Icon">
          <div className="Transactions__WalletSelector__Icon__Triangle" />
          <IdIcons.Variable
            iconid={displayed.id}
            className="Transactions__WalletSelector__Icon__Circle"
          />
        </div>
        <div className="Transactions__WalletSelector__Display">
          <div className="Transactions__WalletSelector__Display__Name">{displayed.name}</div>
          <div className="Transactions__WalletSelector__Display__Money">
            MXN:&nbsp;
            <div className={displayed.money >= 0 ? '' : 'negative'}>
              {ParseMoneyAmount(displayed.money)}
            </div>
          </div>
        </div>
      </div>

      {/* Selector */}
      <Modal setModal={setModal} showModal={showModal} title="Select a wallet">
        <div className="Transactions__WalletSelector__Modal">
          <div className="Transactions__WalletSelector__Container__Total">
            <TransactionHeaderWallet onClick={selectWallet} total={displayed.total} key="-1" />
          </div>
          <div className="Transactions__walletSelector__Container__Head" />
          <div className="Transactions__WalletSelector__Container">
            {wallets.map((wallet: Objects.Wallet) => (
              <TransactionHeaderWallet onClick={selectWallet} wallet={wallet} key={wallet._id} />
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

const TransactionHeaderWallet = (props: WalletProps): JSX.Element => {
  return (
    <div
      className="Transactions__WalletSelector__WalletCard"
      onClick={() => props.onClick(props.wallet)}
    >
      <div
        className={
          props.wallet?.parent_id === undefined || props.wallet?.parent_id === null
            ? 'Transactions__WalletSelector__WalletCard__Main'
            : 'Transactions__WalletSelector__WalletCard__Main SubWallet'
        }
      >
        <IdIcons.Variable
          iconid={props.wallet ? props.wallet.icon_id : -1}
          className={
            props.wallet?.parent_id === undefined || props.wallet?.parent_id === null
              ? 'Transactions__WalletSelector__WalletCard__Icon'
              : 'Transactions__WalletSelector__WalletCard__Icon SubWallet'
          }
        />
        <div className="Transactions__WalletSelector__WalletCard__Text">
          <div
            className={
              props.wallet?.parent_id === undefined || props.wallet?.parent_id === null
                ? 'Transactions__WalletSelector__WalletCard__Text__Name'
                : 'Transactions__WalletSelector__WalletCard__Text__Name SubWallet'
            }
          >
            {props.wallet?.name || 'Total'}
          </div>
          <div
            className={
              props.wallet?.parent_id === undefined || props.wallet?.parent_id === null
                ? 'Transactions__WalletSelector__WalletCard__Text__Money'
                : 'Transactions__WalletSelector__WalletCard__Text__Money SubWallet'
            }
          >
            {props.wallet?.currency || 'MXN'}:&nbsp;
            <div className={(props.wallet?.money || 0) < 0 ? 'negative' : ''}>
              {ParseMoneyAmount(props.wallet?.money || props.total)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHeader;
