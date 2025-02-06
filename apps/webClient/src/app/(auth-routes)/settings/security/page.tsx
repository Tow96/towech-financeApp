import { ReactElement } from 'react';
import {
  ChangePasswordFormComponent,
  SendPasswordResetButtonComponent,
  LogoutAllSessionsButtonComponent,
} from '@financeapp/frontend-settings';

const SecuritySettingsPage = (): ReactElement => (
  <main>
    <ChangePasswordFormComponent />
    <div className="my-3 block border-b-2 border-riverbed-900" />
    <SendPasswordResetButtonComponent />
    <div className="my-3 block border-b-2 border-riverbed-900" />
    <LogoutAllSessionsButtonComponent />
  </main>
);

export default SecuritySettingsPage;
