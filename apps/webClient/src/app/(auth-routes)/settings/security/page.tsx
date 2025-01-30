import { ReactElement } from 'react';
import {
  ChangePasswordFormComponent,
  SendPasswordResetComponent,
} from '@financeapp/frontend-settings';

const SecuritySettingsPage = (): ReactElement => (
  <main>
    <ChangePasswordFormComponent />
    <div className="my-3 block border-b-2 border-riverbed-900" />
    <SendPasswordResetComponent />
  </main>
);

export default SecuritySettingsPage;
