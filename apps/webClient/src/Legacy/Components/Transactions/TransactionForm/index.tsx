/** NewTransactionForm.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * The component shown when adding a new transaction, it is a modal
 */
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';

// Components
import Button from '../../Button';
import CategorySelector from '../../CategorySelector';
import Input from '../../Input';
import Datepicker from '../../Datepicker';
import Modal from '../../Modal';

// Hooks
import { MainStore, TransactionPageStore } from '../../../Hooks/ContextStore';
import UseForm from '../../../Hooks/UseForm';

// Models
import { Objects } from '../../../models';

// Services
import TransactionService from '../../../Services/TransactionService';

// Utilities
import CheckNested from '../../../Utils/CheckNested';
import Errorbox from '../../ErrorBox';
import Checkbox from '../../Checkbox';
import { IdIcons } from '../../../Icons';

// Styles
import './TransactionForm.css';
import { useAuthentication } from '@financeapp/frontend-authentication';

interface Props {
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  state: boolean;
  initialTransaction?: Objects.Transaction;
}

const Index = (props: Props): ReactElement => {
  // Authentication Token Context
  const { dispatchWallets } = useContext(MainStore);
  const { data: user } = useAuthentication();
  const { transactionState, dispatchTransactionState } = useContext(TransactionPageStore);

  // Starts the services
  const transactionService = new TransactionService(user?.token);

  // Hooks
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({} as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [deleteWarn, setDeleteWarn] = useState(false);

  const transactionForm = UseForm(null, {
    wallet_id: props.initialTransaction?.wallet_id || transactionState.selectedWallet._id || '',
    category_id: props.initialTransaction?.category._id || '-1',
    concept: props.initialTransaction?.concept || '',
    amount: ((props.initialTransaction?.amount || 0) / 100).toString(),
    excludeFromReport: props.initialTransaction?.excludeFromReport || false,
    transactionDate: props.initialTransaction?.transactionDate || new Date(),
    // Values exclusive to transfers
    from_id: '-1',
    to_id: '-1',
  });

  // Use Effect that resets the initial option for wallet if the selected wallet changes
  useEffect(() => {
    if (
      props.state &&
      !props.initialTransaction &&
      transactionState.selectedWallet._id !== transactionForm.values.wallet_id
    ) {
      transactionForm.onChange({
        target: {
          type: 'custom-select',
          name: 'wallet_id',
          value: transactionState.selectedWallet._id,
        },
      });
    }
  }, [props.state]); // eslint-disable-line

  // Callbacks for each type of HTTP operation
  async function newTransactionCallback() {
    try {
      // If no wallet was entered, returns an error
      if (transactionForm.values.wallet_id === '' || transactionForm.values.wallet_id === '-1') {
        setErrors({ wallet_id: 'Select a wallet' });
        return;
      }

      // If no category was entered, returns an error
      if (
        transactionForm.values.category_id === '' ||
        transactionForm.values.category_id === '-1'
      ) {
        setErrors({ category_id: 'Select a category' });
        return;
      }
      // Sends the transaction to the API
      const res = await transactionService.newTransaction(transactionForm.values, setLoading);
      setErrors([]);

      // Clears the form, adds the transaction to the list and closes the modal
      transactionForm.clear();

      dispatchWallets({
        type: 'UPDATE-AMOUNT',
        payload: { wallets: res.data.wallets },
      });
      dispatchTransactionState({
        type: 'ADD',
        payload: { transactions: res.data.newTransactions },
      });
      props.setState(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setLoading(false);
      if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      else console.log(err);
    }
  }

  async function editTransactionCallback() {
    try {
      if (transactionForm.values.category_id === '-2') {
        return;
      }

      // If no wallet was entered, returns an error
      if (transactionForm.values.wallet_id === '' || transactionForm.values.wallet_id === '-1') {
        setErrors({ wallet_id: 'Select a wallet' });
        return;
      }

      // Sends the transaction to the API
      const res = await transactionService.editTransaction(
        props.initialTransaction?._id || '',
        transactionForm.values,
        setLoading
      );
      setErrors([]);

      props.setState(false);

      dispatchWallets({
        type: 'UPDATE-AMOUNT',
        payload: { wallets: res.data.wallets },
      });

      dispatchTransactionState({
        type: 'EDIT',
        payload: { transactions: res.data.newTransactions },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setLoading(false);
      if (err.response.status === 304) props.setState(false);
      else if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      else console.log(err.response);
    }
  }

  async function deleteTransaction() {
    try {
      if (!props.initialTransaction)
        throw {
          response: `Somehow you managed to delete a transaction without an initial transaction, stop messing with the app pls`,
        };

      const res = await transactionService.deleteTransaction(
        props.initialTransaction._id,
        setLoading
      );

      dispatchWallets({
        type: 'UPDATE-AMOUNT',
        payload: { wallets: res.data.wallets },
      });
      dispatchTransactionState({
        type: 'DELETE',
        payload: { transactions: res.data.newTransactions },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err.response);
    }
  }

  async function transferTransactionCallback() {
    try {
      const errorHolder = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any

      // If no wallets were entered, returns an error
      if (transactionForm.values.from_id === '' || transactionForm.values.from_id === '-1') {
        errorHolder.from_id = 'Select an origin wallet';
      }
      if (transactionForm.values.to_id === '' || transactionForm.values.to_id === '-1') {
        errorHolder.to_id = 'Select a destination wallet';
      }

      // If no category was entered, returns an error
      if (
        transactionForm.values.category_id === '' ||
        transactionForm.values.category_id === '-1'
      ) {
        errorHolder.category_id = 'Select a category';
        return;
      }

      if (Object.keys(errorHolder).length > 0) return setErrors(errorHolder);

      const res = await transactionService.transferBetweenWallets(
        transactionForm.values,
        setLoading
      );
      setErrors([]);

      // Clears the form, adds the transaction to the list and closes the modal
      transactionForm.clear();

      dispatchWallets({
        type: 'UPDATE-AMOUNT',
        payload: { wallets: res.data.wallets },
      });
      dispatchTransactionState({
        type: 'ADD',
        payload: { transactions: res.data.newTransactions },
      });

      props.setState(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      else console.log(err);
    }
  }

  const acceptIcon = <FaIcons.FaSave />;

  const acceptCallback = () => {
    if (props.initialTransaction) {
      return editTransactionCallback();
    }
    if (transactionForm.values.category_id === '-2') {
      return transferTransactionCallback();
    }
    return newTransactionCallback();
  };

  return (
    <>
      {/* Main transaction form */}
      <Modal
        showModal={props.state}
        setModal={props.setState}
        loading={loading}
        title={props.initialTransaction ? 'Edit Transaction' : 'New Transaction'}
        accept={acceptIcon}
        onAccept={acceptCallback}
        onClose={() => {
          transactionForm.clear();
          setErrors([]);
        }}
      >
        <div className="TransactionForm">
          {/* Main Transaction data */}
          <div className="TransactionForm__Content">
            {/* Form */}
            <Input
              error={!!errors.amount}
              label="Amount"
              name="amount"
              type="number"
              value={transactionForm.values.amount}
              onChange={transactionForm.onChange}
            />
            {/* Category selector */}
            <CategorySelector
              edit={!!props.initialTransaction}
              error={errors.category_id}
              name="category_id"
              onChange={transactionForm.onChange}
              transfer={!!props.initialTransaction?.transfer_id}
              value={transactionForm.values.category_id}
              visible={props.state}
            ></CategorySelector>

            {/* Wallet selector and date picker for regular transactions */}
            {transactionForm.values.category_id !== '-2' && (
              <div className="TransactionForm__Content__Splitted">
                <div className="TransactionForm__Content__Splitted__Wallet">
                  <WalletSelector
                    onChange={transactionForm.onChange}
                    name="wallet_id"
                    value={transactionForm.values.wallet_id}
                    visible={props.state}
                    error={errors.wallet_id}
                    disabled={!!props.initialTransaction?.transfer_id}
                  />
                </div>

                {/* Date field */}
                <Datepicker
                  label="Date"
                  name="transactionDate"
                  value={transactionForm.values.transactionDate}
                  onChange={transactionForm.onChange}
                />
              </div>
            )}

            {/* Wallet selectors and datepicker for transference transactions */}
            {transactionForm.values.category_id === '-2' && (
              <>
                <div className="TransactionForm__Content__Splitted">
                  <div className="TransactionForm__Content__Splitted__Label">From</div>
                  <div className="TransactionForm__Content__Splitted__Label">To</div>
                </div>
                <div className="TransactionForm__Content__Splitted">
                  <div className="TransactionForm__Content__Splitted__Wallet">
                    <WalletSelector
                      error={errors.from_id}
                      name="from_id"
                      onChange={transactionForm.onChange}
                      value={transactionForm.values.from_id}
                      visible={props.state}
                    />
                  </div>
                  <div className="TransactionForm__Content__Splitted__Wallet">
                    <WalletSelector
                      error={errors.to_id}
                      name="to_id"
                      onChange={transactionForm.onChange}
                      value={transactionForm.values.to_id}
                      visible={props.state}
                    />
                  </div>
                </div>
                {/* Date field */}
                <Datepicker
                  label="Date"
                  name="transactionDate"
                  value={transactionForm.values.transactionDate}
                  onChange={transactionForm.onChange}
                />
              </>
            )}

            {/* Concept field */}
            <Input
              error={!!errors.name}
              label="Concept"
              name="concept"
              type="text"
              value={transactionForm.values.concept}
              onChange={transactionForm.onChange}
            />

            {/* Exclude from report checkbox */}
            <Checkbox
              dark
              checked={transactionForm.values.excludeFromReport}
              name="excludeFromReport"
              label="Exclude transaction from report"
              onChange={transactionForm.onChange}
            ></Checkbox>

            {/* Error Box */}
            <Errorbox errors={errors} setErrors={setErrors} />
          </div>

          {/* Delete Transaction button */}
          {props.initialTransaction && (
            <div>
              <Button warn className="TransactionForm__Delete" onClick={() => setDeleteWarn(true)}>
                <>
                  <div className="TransactionForm__Delete__Icon">
                    <FaIcons.FaTrashAlt />
                  </div>
                  Delete Transaction
                </>
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* delete transaction Modal */}
      {props.initialTransaction && (
        <Modal
          float
          setModal={setDeleteWarn}
          showModal={deleteWarn}
          accept="Delete"
          onAccept={deleteTransaction}
          loading={loading}
        >
          <>
            <p>Are you sure you want to delete this transaction?</p>
            This action cannot be undone.
          </>
        </Modal>
      )}
    </>
  );
};

// ------------------------------------------------------------------------------------------
interface WalletSelectorProps {
  error?: boolean;
  value?: string;
  onChange?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  name?: string;
  visible: boolean;
  disabled?: boolean;
}

const WalletSelector = (props: WalletSelectorProps): ReactElement => {
  const { wallets } = useContext(MainStore);

  // Hooks
  const [showModal, setShowModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null as Objects.Wallet | null);

  // Start useEffect only updates when the form is visible
  useEffect(() => {
    if (props.visible && props.value !== (selectedWallet?._id || '-1')) {
      searchAndSetView(props.value || '-1');
    }
  }, [props.visible, props.value]); // eslint-disable-line

  // Functions
  const searchAndSetView = (id: string): void => {
    const p = wallets.find((wallet) => wallet._id === id);
    setSelectedWallet(p || null);
  };

  const setWalletCallback = (id: string): void => {
    searchAndSetView(id);
    if (props.onChange) {
      props.onChange({
        target: {
          type: 'custom-select',
          name: props.name,
          value: id,
        },
      });
    }
    setShowModal(false);
  };

  const getSelectedWalletClass = (wallet: Objects.Wallet): string => {
    let output = 'TransactionForm__WalletSelector__WalletCard__Icon';

    if (wallet.parent_id !== undefined && wallet.parent_id !== null) {
      output += ' SubWallet';
    }

    if (wallet._id === props.value) {
      output += ' selected';
    }

    return output;
  };

  return (
    <div className={props.disabled ? 'loading' : ''}>
      <div
        className={
          props.error ? 'TransactionForm__WalletSelector error' : 'TransactionForm__WalletSelector'
        }
        onClick={() => setShowModal(true)}
      >
        <IdIcons.Variable
          iconId={selectedWallet?.icon_id || 0}
          className="TransactionForm__WalletSelector__Icon"
        />
        <div className="TransactionForm__WalletSelector__Name">
          {selectedWallet?.name || 'Select Wallet'}
        </div>
        <div className="TransactionForm__WalletSelector__Open">
          <div className="TransactionForm__WalletSelector__Triangle" />
        </div>
      </div>

      <Modal showModal={showModal} setModal={setShowModal} title="Select Wallet">
        <div className="TransactionForm__WalletSelector__Container">
          {wallets.map((wallet: Objects.Wallet) => (
            <div
              key={wallet._id}
              className="TransactionForm__WalletSelector__WalletCard"
              onClick={() => setWalletCallback(wallet._id)}
            >
              <div
                className={
                  wallet.parent_id === undefined || wallet.parent_id === null
                    ? 'TransactionForm__WalletSelector__WalletCard__Main'
                    : 'TransactionForm__WalletSelector__WalletCard__Main SubWallet'
                }
              >
                <IdIcons.Variable
                  iconId={wallet.icon_id}
                  className={getSelectedWalletClass(wallet)}
                />
                <div className="TransactionForm__WalletSelector__WalletCard__Name">
                  {wallet.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Index;
