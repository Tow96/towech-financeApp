/** ManageUsers.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Component that allows an admin to manage users
 */
import React, { useContext, useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';

// Components
import Button from '../../Components/Button';
import Checkbox from '../../Components/Checkbox';
import Errorbox from '../../Components/ErrorBox';
import Input from '../../Components/Input';
import Modal from '../../Components/Modal';

// Hooks
import { MainStore, ManageUsersStore } from '../../Hooks/ContextStore';
import UseForm from '../../Hooks/UseForm';
import UseUsers from '../../Hooks/UseUsers';

// Models
import { Objects } from '../../models';

// Services
import UserService from '../../Services/UserService';

// Utilities
import CheckNested from '../../Utils/CheckNested';

// Interfaces
interface MenuProps {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserCardProps {
  user: Objects.User.BaseUser;
}

interface UserFormProps {
  set: React.Dispatch<React.SetStateAction<boolean>>;
  state: boolean;
  initialUser?: Objects.User.BaseUser;
}

export default class ManageUsers {
  static Menu = (props: MenuProps): JSX.Element => {
    // Context
    const { authToken, dispatchAuthToken } = useContext(MainStore);

    // Starts the service
    const userService = new UserService(authToken, dispatchAuthToken);

    // Hooks
    //const [users, setUsers] = useState([] as Objects.User.BaseUser[]);
    const [userState, dispatchUserState] = UseUsers([]);
    const [showForm, setForm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (props.state) {
        userService.getUsers(setLoading).then((res) => {
          dispatchUserState({ type: 'SET', payload: res.data });
        });
      }
    }, [props.state]);

    return (
      <ManageUsersStore.Provider value={{ userState, dispatchUserState }}>
        <Modal
          loading={loading}
          showModal={props.state}
          setModal={props.setState}
          title={'Manage users'}
        >
          <div className="ManageUsers">
            {userState.map((user) => (
              <ManageUsers.UserCard key={user._id} user={user} />
            ))}
          </div>
          <Button accent round className="ManageUsers__AddFloat" onClick={() => setForm(true)}>
            <FaIcons.FaPlus />
          </Button>
        </Modal>
        <ManageUsers.UserForm set={setForm} state={showForm} />
      </ManageUsersStore.Provider>
    );
  };

  private static UserCard = (props: UserCardProps): JSX.Element => {
    const [showModal, setModal] = useState(false);

    return (
      <>
        <div className="ManageUsers__UserCard" onClick={() => setModal(true)}>
          {props.user.name}
        </div>
        <ManageUsers.UserForm set={setModal} state={showModal} initialUser={props.user} />
      </>
    );
  };

  private static UserForm = (props: UserFormProps): JSX.Element => {
    // Context
    const { authToken, dispatchAuthToken } = useContext(MainStore);
    const { dispatchUserState } = useContext(ManageUsersStore);

    // Starts the services
    const userService = new UserService(authToken, dispatchAuthToken);

    // Hooks
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({} as any);
    const [deleteWarn, setDeleteWarn] = useState(false);

    // Data for the userForm
    const userForm = UseForm(null, {
      name: props.initialUser?.name || '',
      username: props.initialUser?.username || '',
      admin: props.initialUser?.role === 'admin' || false,
    });

    // Functions
    async function registerUser() {
      try {
        // Sends the new user to the API
        const res = await userService.registerUser(
          {
            email: userForm.values.username,
            name: userForm.values.name,
            role: userForm.values.admin ? 'admin' : 'user',
          },
          setLoading
        );
        // Clears the form, sets wallets and closes the modal
        userForm.clear();
        dispatchUserState({ type: 'SET', payload: [res.data] });
        props.set(false);
      } catch (err: any) {
        if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
        else console.log(err.response); // eslint-disable-line no-console
      }
    }

    async function editUser() {
      try {
        if (!props.initialUser)
          throw {
            response: `Somehow you managed to edit a user without an initial user, stop messing with the app pls`,
          };
        const editedUser = userForm.values as Objects.User.BackendUser;
        editedUser._id = props.initialUser._id;

        // Sends the wallet to the API
        const res = await userService.editUser(editedUser._id, editedUser, setLoading);
        // Sets the wallet and closes the modal
        dispatchUserState({ type: 'EDIT', payload: [res.data] });
        props.set(false);
      } catch (err: any) {
        // If there is a 304 status, then the modal is closed
        if (err.response.status == 304) props.set(false);
        else if (CheckNested(err, 'response', 'data', 'errors'))
          setErrors(err.response.data.errors);
        else console.log(err.response); // eslint-disable-line no-console
      }
    }

    async function deleteUser() {
      try {
        if (!props.initialUser)
          throw {
            response: `Somehow you managed to delete a user without an initial wallet, stop messing with the app pls`,
          };
        await userService.deleteUser(props.initialUser._id, setLoading);
        dispatchUserState({ type: 'DELETE', payload: [props.initialUser] });
      } catch (err: any) {
        console.log(err.response); // eslint-disable-line no-console
      }
    }

    const acceptIcon = <FaIcons.FaSave />;

    return (
      <>
        <Modal
          showModal={props.state}
          setModal={props.set}
          loading={loading}
          title={props.initialUser ? 'Edit User' : 'New User'}
          accept={acceptIcon}
          onAccept={() => {
            props.initialUser ? editUser() : registerUser();
          }}
          onClose={() => {
            userForm.clear();
            setErrors([]);
          }}
        >
          <div className="UserForm">
            {/* Form */}
            <div className="UserForm__FirstRow">
              <Input
                error={errors.name ? true : false}
                label="Name"
                name="name"
                type="text"
                value={userForm.values.name}
                onChange={userForm.onChange}
              />
              <Checkbox
                dark
                label="Admin"
                name="admin"
                checked={userForm.values.admin}
                onChange={userForm.onChange}
              />
            </div>
            <Input
              error={errors.name ? true : false}
              label="email"
              name="username"
              type="text"
              value={userForm.values.username}
              onChange={userForm.onChange}
            />
            {/* Error Box */}
            <Errorbox errors={errors} setErrors={setErrors}></Errorbox>

            {props.initialUser && (
              <>
                {/* Delete user button */}
                <div>
                  <Button
                    warn
                    className="NewWalletForm__Delete"
                    onClick={() => setDeleteWarn(true)}
                  >
                    <>
                      <FaIcons.FaTrashAlt className="NewWalletForm__Delete__Icon" />
                      Delete User
                    </>
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal>

        {/* Delete user warning */}
        {props.initialUser && (
          <Modal
            float
            setModal={setDeleteWarn}
            showModal={deleteWarn}
            accept="Delete"
            onAccept={deleteUser}
          >
            <>
              <p>Are you sure you want to delete the user: {props.initialUser.name}?</p>
              This action will pemanently remove the user and all data associated to them. This
              action cannot be undone.
            </>
          </Modal>
        )}
      </>
    );
  };
}
