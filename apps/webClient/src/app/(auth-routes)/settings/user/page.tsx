import { ReactElement } from 'react';
// Components
import {
  EditUserFormComponent,
  DeleteUserButtonComponent,
  VerifyUserButtonComponent,
} from '@financeapp/frontend-settings';

const UserSettingsPage = (): ReactElement => (
  <main>
    <EditUserFormComponent />
    <div className="border-riverbed-900 my-3 block border-b-2" />
    <VerifyUserButtonComponent />
    <div className="border-riverbed-900 my-3 block border-b-2" />
    <DeleteUserButtonComponent />
  </main>
);

export default UserSettingsPage;
