import { ReactElement } from 'react';
import {
  ChangePasswordFormComponent,
  SendPasswordResetButtonComponent,
  LogoutAllSessionsButtonComponent,
} from '@financeapp/frontend-settings';

const SecuritySettingsPage = (): ReactElement => (
  <main>
    <ChangePasswordFormComponent />
    <div className="border-riverbed-900 my-3 block border-b-2" />
    <SendPasswordResetButtonComponent />
    <div className="border-riverbed-900 my-3 block border-b-2" />
    <LogoutAllSessionsButtonComponent />
  </main>
);

export default SecuritySettingsPage;
