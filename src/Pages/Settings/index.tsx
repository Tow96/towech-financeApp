/** Home.tsx
 * Copyright (c) 2021, Towechlabs
 * All rights reserved
 *
 * Settings Page for the App
 */
import { useContext, useState } from 'react';

// Components
import Page from '../../Components/Page';
import SettingCard from './SettingCard';
import EditNameForm from './Functions/EditNameForm';
import ChangePasswordForm from './Functions/ChangePasswordForm';
import ChangeEmailForm from './Functions/ChangeEmailForm';
import ResendVerification from './Functions/ResendVerification';
import LogoutAll from './Functions/LogoutAll';
import ManageUsers from './Functions/ManageUsers';

// Hooks
import { MainStore } from '../../Hooks/ContextStore';

// Styles
import './Settings.css';

const Settings = (): JSX.Element => {
  // Context
  const { authToken } = useContext(MainStore);

  // Hooks
  const [editNameModal, setEditNameModal] = useState(false);
  const [changePassModal, setChangePassModal] = useState(false);
  const [changeEmailModal, setChangeEmailModal] = useState(false);
  const [resendVerification, setResendVerification] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [manageUsers, setManageUsers] = useState(false);

  // Functions

  // Only refreshes the page and allows a new token to regenerate the user data
  async function editUser() {
    window.location.reload();
  }

  const header = <h1>Settings</h1>;

  return (
    <Page header={header} selected="Settings">
      <div className="Settings">
        <div className="Settings__Container">
          <SettingCard
            title="Change name"
            onClick={() => {
              setEditNameModal(true);
            }}
          />
          <SettingCard
            title="Change email"
            onClick={() => {
              setChangeEmailModal(true);
            }}
          />
          {!authToken.accountConfirmed && (
            <SettingCard
              title="Resend verification email"
              onClick={() => {
                setResendVerification(true);
              }}
            />
          )}
          <SettingCard
            title="Change password"
            onClick={() => {
              setChangePassModal(true);
            }}
          />
          {authToken.role === 'admin' && (
            <SettingCard
              title="Manage users"
              onClick={() => {
                setManageUsers(true);
              }}
            />
          )}
          <SettingCard
            title="Logout from all devices"
            onClick={() => {
              setLogoutModal(true);
            }}
          />
        </div>
        <EditNameForm state={editNameModal} setState={setEditNameModal} resultState={editUser} />
        <ChangePasswordForm state={changePassModal} setState={setChangePassModal} resultState={editUser} />
        <ChangeEmailForm state={changeEmailModal} setState={setChangeEmailModal} resultState={editUser} />
        <ResendVerification state={resendVerification} setState={setResendVerification} />
        <LogoutAll state={logoutModal} setState={setLogoutModal} />
        <ManageUsers.Menu state={manageUsers} setState={setManageUsers} />
      </div>
    </Page>
  );
};

export default Settings;
