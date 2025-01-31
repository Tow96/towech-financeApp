import { ReactElement } from 'react';
import {
  ChangePasswordFormComponent,
  SendPasswordResetComponent,
  LogoutAllSessionsComponent,
} from '@financeapp/frontend-settings';

const SecuritySettingsPage = (): ReactElement => (
  <main>
    <ChangePasswordFormComponent />
    <div className="my-3 block border-b-2 border-riverbed-900" />
    <SendPasswordResetComponent />
    <div className="my-3 block border-b-2 border-riverbed-900" />
    <LogoutAllSessionsComponent />
  </main>
);

export default SecuritySettingsPage;
