/**TransactionCard.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Component that shows the Transaction elements
 */
// Libraries
import { useContext, useState } from 'react';

// Components
import NewTransactionForm from '../../TransactionForm';

// Hooks
import { MainStore, TransactionPageStore } from '../../../../Hooks/ContextStore';
import { FrontendTransaction } from '../../../../Hooks/UseTransactions';

// Utils
import ParseMoneyAmount from '../../../../Utils/ParseMoneyAmount';
import { IdIcons } from '../../../../Icons';

// Styles
import './TransactionCard.css';

interface Props {
  transaction: FrontendTransaction;
}

const TransactionCard = (props: Props): JSX.Element => {
  // Contextx
  const { wallets } = useContext(MainStore);
  const { transactionState } = useContext(TransactionPageStore);

  // Hooks
  const [showEdit, setEdit] = useState(false);
  const transDate = new Date(props.transaction.transactionDate);

  // Functions -------------------------------------------------------------
  const getTransactionIconId = (): number => {
    if (!props.transaction.transfer_id) return props.transaction.category.icon_id;

    return -2;
  };

  const getWalletIconId = (id: string): number => {
    const wallet = wallets.find((x) => {
      return x._id.toString() === id;
    });

    return wallet?.icon_id || -1;
  };

  const getAmountClass = (): string => {
    const baseClass = 'TransactionCard__Content__Top__Amount';

    if (props.transaction.transfer_id && props.transaction.from_wallet && props.transaction.to_wallet) return baseClass;
    if (props.transaction.category.type === 'Expense') return `${baseClass} negative`;
    return `${baseClass} positive`;
  };

  const displayAmount = (): string => {
    const amount = ParseMoneyAmount(props.transaction.amount);
    if (props.transaction.transfer_id && props.transaction.from_wallet && props.transaction.to_wallet) return amount;
    if (props.transaction.category.type === 'Expense') return `- ${amount}`;
    return `+ ${amount}`;
  };

  const getWalletIcons = (): JSX.Element => {
    if (props.transaction.transfer_id) {
      return (
        <>
          {props.transaction.from_wallet && (
            <IdIcons.Variable
              iconid={getWalletIconId(props.transaction.from_wallet)}
              className="TransactionCard__Icon__Sub"
            />
          )}
          {props.transaction.to_wallet && (
            <IdIcons.Variable
              iconid={getWalletIconId(props.transaction.to_wallet)}
              className="TransactionCard__Icon__Sub r"
            />
          )}
        </>
      );
    }

    if (transactionState.selectedWallet._id !== props.transaction.wallet_id) {
      return (
        <IdIcons.Variable
          iconid={getWalletIconId(props.transaction.wallet_id)}
          className="TransactionCard__Icon__Sub r"
        />
      );
    }

    return <></>;
  };

  // -----------------------------------------------------------------------

  return (
    <>
      <div className="TransactionCard" onClick={() => setEdit(true)}>
        <div className="TransactionCard__Main">
          <div className="TransactionCard__Icon">
            <IdIcons.Variable iconid={getTransactionIconId()} className="TransactionCard__Icon__Main" />
            {getWalletIcons()}
          </div>
          <div className="TransactionCard__Content">
            <div className="TransactionCard__Content__Top">
              <div className="Transaction__Content__Top__Category">{props.transaction.category.name}</div>
              <div className={getAmountClass()}>{displayAmount()}</div>
            </div>
            <div className="TransactionCard__Content__Bottom">
              <div className="TransactionCard__Content__Bottom__Concept">{props.transaction.concept}</div>
              <div className="TransactionCard__Content__Bottom__Date">
                {transDate.getUTCDate().toString().padStart(2, '0')}/
                {(transDate.getUTCMonth() + 1).toString().padStart(2, '0')}/
                {transDate.getUTCFullYear().toString().padStart(4, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Wallet Modal */}
      <NewTransactionForm state={showEdit} setState={setEdit} initialTransaction={props.transaction} />
    </>
  );
};

export default TransactionCard;
