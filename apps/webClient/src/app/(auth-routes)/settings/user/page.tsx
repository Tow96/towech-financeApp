import { ReactElement } from 'react';
// Components
import {
  EditUserFormComponent,
  DeleteUserButtonComponent,
  VerifyUserComponent,
} from '@financeapp/frontend-settings';

const UserSettingsPage = (): ReactElement => (
  <main>
    <EditUserFormComponent />
    <div className="my-3 block border-b-2 border-riverbed-900" />
    <VerifyUserComponent />
    <div className="my-3 block border-b-2 border-riverbed-900" />
    <DeleteUserButtonComponent />
  </main>
);

export default UserSettingsPage;
