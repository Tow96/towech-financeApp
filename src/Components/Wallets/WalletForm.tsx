/** WalletForm.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * The component shown when adding or editing a Wallet, it is a modal
 */
import React, { useContext, useState } from 'react';
import * as FaIcons from 'react-icons/fa';

// Components
import { MainStore } from '../../Hooks/ContextStore';
import { IdIcons } from '../../Icons';
import Button from '../../Components/Button';
import Errorbox from '../../Components/ErrorBox';
import IconSelector from '../../Components/IconSelector';
import Input from '../../Components/Input';
import Modal from '../../Components/Modal';

// Hooks
import UseForm from '../../Hooks/UseForm';

// Models
import { Objects } from '../../models';

// Services
import TransactionService from '../../Services/TransactionService';

// Utilities
import CheckNested from '../../Utils/CheckNested';
import ParseMoneyAmount from '../../Utils/ParseMoneyAmount';

interface Props {
  set: React.Dispatch<React.SetStateAction<boolean>>;
  state: boolean;
  initialWallet?: Objects.Wallet;
}

const WalletForm = (props: Props): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken, dispatchWallets } = useContext(MainStore);

  // Starts the services
  const transactionService = new TransactionService(authToken, dispatchAuthToken);

  // Hooks
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({} as any);
  const [deleteWarn, setDeleteWarn] = useState(false);
  const [showSubWallets, setShowSubWallets] = useState(false);

  // Creates the new walletForm
  const walletForm = UseForm(null, {
    name: props.initialWallet?.name || '',
    money: ((props.initialWallet?.money || 0) / 100).toString(),
    currency: props.initialWallet?.currency || 'MXN',
    icon_id: props.initialWallet?.icon_id || 0,
  });

  // Functions
  async function newWalletCallback() {
    try {
      // Sends the wallet to the API
      const res = await transactionService.newWallet(walletForm.values, setLoading);

      // Clears the form, sets wallets and closes the modal
      walletForm.clear();
      dispatchWallets({ type: 'ADD', payload: { wallets: [res.data] } });
      props.set(false);
    } catch (err: any) {
      if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      else console.log(err.response); // eslint-disable-line no-console
    }
  }

  async function editWalletCallback() {
    try {
      if (!props.initialWallet)
        throw {
          response: `Somehow you managed to edit a wallet without an initial wallet, stop messing with the app pls`,
        };

      const editedWallet = walletForm.values as Objects.Wallet;
      editedWallet._id = props.initialWallet._id;

      // Sends the wallet to the API
      const res = await transactionService.editWallet(editedWallet, setLoading);

      // Sets the wallet and closes the modal
      dispatchWallets({ type: 'EDIT', payload: { wallets: [res.data] } });
      props.set(false);
    } catch (err: any) {
      // If there is a 304 status, then the modal is closed
      if (err.response.status == 304) props.set(false);
      else if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      else console.log(err.response); // eslint-disable-line no-console
    }
  }

  async function deleteWallet() {
    try {
      if (!props.initialWallet)
        throw {
          response: `Somehow you managed to delete a wallet without an initial wallet, stop messing with the app pls`,
        };

      await transactionService.deleteWallet(props.initialWallet._id, setLoading);

      dispatchWallets({ type: 'DELETE', payload: { wallets: [props.initialWallet] } });
    } catch (err: any) {
      console.log(err.response); // eslint-disable-line no-console
    }
  }

  const acceptIcon = <FaIcons.FaSave />;

  // Returns the amount of money that doesn't belong to subwallets
  const calculateFree = (): string => {
    if (!props.initialWallet) return '0.00';

    let money = props.initialWallet.money || 0;

    // Reads every subwallet
    props.initialWallet.child_id?.map((x) => {
      // Only substracts if the child wallet is into debt, this way, the debt is reflected on the parent as well
      if ((x.money || 0) > 0) {
        money -= x.money || 0;
      }
    });

    return ParseMoneyAmount(money);
  };

  return (
    <>
      <Modal
        showModal={props.state}
        setModal={props.set}
        loading={loading}
        title={props.initialWallet ? 'Edit Wallet' : 'New Wallet'}
        accept={acceptIcon}
        onAccept={() => {
          props.initialWallet ? editWalletCallback() : newWalletCallback();
        }}
        onClose={() => {
          walletForm.clear();
          setErrors([]);
        }}
      >
        <div className="WalletForm">
          {/* Main Wallet data */}
          <div className="WalletForm__Main">
            {/* Form */}
            <div className="WalletForm__Main__FirstRow">
              <IconSelector
                className="WalletForm__Main__FirstRow__Icon"
                name="icon_id"
                value={walletForm.values.icon_id}
                onChange={walletForm.onChange}
              />
              <div className="WalletForm__Main__FirstRow__Name">
                <Input
                  error={errors.name ? true : false}
                  label="Name"
                  name="name"
                  type="text"
                  value={walletForm.values.name}
                  onChange={walletForm.onChange}
                />
              </div>
            </div>
            <div className="WalletForm__Main__SecondRow">
              <div className="WalletForm__Main__SecondRow__Money">
                <Input
                  error={errors.amount ? true : false}
                  name="money"
                  type="number"
                  label="Money"
                  disabled={props.initialWallet ? true : false}
                  value={walletForm.values.money}
                  onChange={walletForm.onChange}
                />
              </div>
              <div className="WalletForm__Main__SecondRow__Currency">
                <Input
                  error={errors.currency ? true : false}
                  name="currency"
                  type="text"
                  label="Currency"
                  value={walletForm.values.currency}
                  onChange={walletForm.onChange}
                />
              </div>
            </div>

            {/* Error Box */}
            <Errorbox errors={errors} setErrors={setErrors}></Errorbox>
          </div>

          {/* Subwallets and delete wallet button, only available if editing the wallet */}
          {props.initialWallet && (
            <>
              {/* Subwallets */}
              <div className="WalletForm__Subwallets">
                <div className="WalletForm__Subwallets__Title">Subwallets</div>
                <div className="WalletForm__Subwallets__Container">
                  {/* Money in the wallet that it hasn't been asigned to a subwallet */}
                  {(props.initialWallet.child_id?.length || 0) > 0 && (
                    <div className="WalletForm__Subwallets__Unassigned">
                      Unasigned:&nbsp;&nbsp;&nbsp;{calculateFree()}
                    </div>
                  )}
                  {/* SubWallets */}
                  {props.initialWallet.child_id?.map((x) => (
                    <SubWalletCard
                      key={x._id}
                      parentWallet={props.initialWallet || ({} as Objects.Wallet)}
                      wallet={x}
                    />
                  ))}
                  {/* Add SubWallet Button */}
                  <div
                    className={
                      props.initialWallet.child_id?.length === 0
                        ? 'WalletForm__Subwallets__Add alone'
                        : 'WalletForm__Subwallets__Add'
                    }
                    onClick={() => {
                      setShowSubWallets(true);
                    }}
                  >
                    <div className="WalletForm__Subwallets__Add__Icon">
                      <FaIcons.FaPlusCircle />
                    </div>
                    <div>Add new subwallet</div>
                  </div>
                </div>

                <SubWalletForm state={showSubWallets} set={setShowSubWallets} parentWallet={props.initialWallet} />
              </div>

              {/* Delete wallet button */}
              <div>
                <Button warn className="WalletForm__Delete" onClick={() => setDeleteWarn(true)}>
                  <>
                    {/* <div className="NewWalletForm__Delete__Icon"> */}
                    <FaIcons.FaTrashAlt className="WalletForm__Delete__Icon" />
                    {/* </div> */}
                    Delete Wallet
                  </>
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {props.initialWallet && (
        <Modal float setModal={setDeleteWarn} showModal={deleteWarn} accept="Delete" onAccept={deleteWallet}>
          <>
            <p>Are you sure you want to delete the wallet: {props.initialWallet.name}?</p>
            This action cannot be undone.
          </>
        </Modal>
      )}
    </>
  );
};

// SubWalletsForm -----------------------------------------------------------------

interface SubWalletProps {
  set: React.Dispatch<React.SetStateAction<boolean>>;
  state: boolean;
  parentWallet: Objects.Wallet;
  initialWallet?: Objects.Wallet;
}

const SubWalletForm = (props: SubWalletProps): JSX.Element => {
  const { authToken, dispatchAuthToken, dispatchWallets } = useContext(MainStore);
  const transactionService = new TransactionService(authToken, dispatchAuthToken);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({} as any);
  const [showDelete, setDelete] = useState(false);

  // Creates the new walletForm
  const subWalletForm = UseForm(null, {
    name: props.initialWallet?.name || '',
    money: props.initialWallet?.money?.toString() || '0',
    currency: props.initialWallet?.currency || props.parentWallet.currency,
    parent_id: props.initialWallet?.parent_id || props.parentWallet._id,
    icon_id: props.initialWallet?.icon_id || 0,
  });

  // Functions
  async function newWalletCallback() {
    try {
      // Sends the wallet to the API
      const res = await transactionService.newWallet(subWalletForm.values, setLoading);

      // Clears the form, sets wallets and closes the modal
      subWalletForm.clear();
      dispatchWallets({ type: 'ADD', payload: { wallets: [res.data] } });
      props.set(false);
    } catch (err: any) {
      if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      else console.log(err.response); // eslint-disable-line no-console
    }
  }

  async function editWalletCallback() {
    try {
      if (!props.initialWallet)
        throw {
          response: `Somehow you managed to edit a wallet without an initial wallet, stop messing with the app pls`,
        };

      const editedWallet = subWalletForm.values as Objects.Wallet;
      editedWallet._id = props.initialWallet._id;

      // Sends the wallet to the API
      const res = await transactionService.editWallet(editedWallet, setLoading);

      // Sets the wallet and closes the modal
      dispatchWallets({ type: 'EDIT', payload: { wallets: [res.data] } });
      props.set(false);
    } catch (err: any) {
      // If there is a 304 status, then the modal is closed
      if (err.response.status == 304) props.set(false);
      else if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      else console.log(err.response); // eslint-disable-line no-console
    }
  }

  async function deleteWallet() {
    try {
      if (!props.initialWallet)
        throw {
          response: `Somehow you managed to delete a wallet without an initial wallet, stop messing with the app pls`,
        };

      await transactionService.deleteWallet(props.initialWallet._id, setLoading);

      dispatchWallets({ type: 'DELETE', payload: { wallets: [props.initialWallet] } });
    } catch (err: any) {
      console.log(err.response); // eslint-disable-line no-console
    }
  }

  const acceptIcon = <FaIcons.FaSave />;

  return (
    <>
      <Modal
        setModal={props.set}
        loading={loading}
        showModal={props.state}
        title={props.initialWallet ? 'Edit subWallet' : 'New subWallet'}
        accept={acceptIcon}
        onAccept={() => {
          props.initialWallet ? editWalletCallback() : newWalletCallback();
        }}
        onClose={() => {
          subWalletForm.clear();
          setErrors([]);
        }}
      >
        <div className="WalletForm">
          <div className="WalletForm__Main__FirstRow">
            <IconSelector
              className="WalletForm__Main__FirstRow__Icon"
              name="icon_id"
              value={subWalletForm.values.icon_id}
              onChange={subWalletForm.onChange}
            />

            <div className="WalletForm__Main__FirstRow__Name">
              <Input
                error={errors.name ? true : false}
                label="Name"
                name="name"
                type="text"
                value={subWalletForm.values.name}
                onChange={subWalletForm.onChange}
              />
            </div>
          </div>

          {/* Delete subwallet button */}
          {props.initialWallet && (
            <div>
              <Button warn className="WalletForm__Delete" onClick={() => setDelete(true)}>
                <>
                  {/* <div className="NewWalletForm__Delete__Icon"> */}
                  <FaIcons.FaTrashAlt className="NewWalletForm__Delete__Icon" />
                  {/* </div> */}
                  Delete SubWallet
                </>
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {props.initialWallet && (
        <Modal float setModal={setDelete} showModal={showDelete} accept="Delete" onAccept={deleteWallet}>
          <>
            <p>Are you sure you want to delete the subWallet: {props.initialWallet.name}?</p>
            This action cannot be undone.
          </>
        </Modal>
      )}
    </>
  );
};

export default WalletForm;

// SubWalletCard ------------------------------------------------------------
interface SubWalletCardProps {
  parentWallet: Objects.Wallet;
  wallet: Objects.Wallet;
}

const SubWalletCard = (props: SubWalletCardProps): JSX.Element => {
  // Hooks
  const [showEdit, setEdit] = useState(false);

  return (
    <>
      <div className="SubWalletCard" onClick={() => setEdit(true)}>
        <div className="SubWalletCard__Main">
          <IdIcons.Variable iconid={props.wallet.icon_id} className="SubWalletCard__Icon" />
          <div className="SubWalletCard__Info">
            <div className="SubWalletCard__Info__Name">{props.wallet.name}</div>
            <div className="SubWalletCard__Info__Money">
              {props.wallet.currency}:&nbsp;
              <div className={(props.wallet.money || 0) >= 0 ? '' : 'negative'}>
                {ParseMoneyAmount(props.wallet.money)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SubWalletForm set={setEdit} state={showEdit} initialWallet={props.wallet} parentWallet={props.parentWallet} />
    </>
  );
};
