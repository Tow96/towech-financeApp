/** Settings.tsx
 * Copyright (c) 2021, Towechlabs
 * All rights reserved
 *
 * Settings Page for the App
 */
'use client';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Components
import Page from '../../Components/Page';
import SettingCard from 'src/Components/Settings/SettingCard';
import EditNameForm from 'src/Functions/Settings/EditNameForm';
import ChangePasswordForm from 'src/Functions/Settings/ChangePasswordForm';
import ChangeEmailForm from 'src/Functions/Settings/ChangeEmailForm';
import ResendVerification from 'src/Functions/Settings/ResendVerification';
import ManageUsers from 'src/Functions/Settings/ManageUsers';
import LogoutAll from 'src/Functions/Settings/LogoutAll';

// Hooks
import { MainStore } from '../../Hooks/ContextStore';

// Styles
import './Settings.css';

export default function Settings() {
  // Context
  const { authToken } = useContext(MainStore);
  const router = useRouter();

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
    router.refresh();
  }

  const header = <h1>Settings</h1>;

  if (!authToken.token) router.push('/?redirect=settings');

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
}
