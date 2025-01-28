import { ReactElement } from 'react';
// Components
import { EditUserFormComponent } from '@financeapp/frontend-settings';

const UserSettingsPage = (): ReactElement => (
  <main>
    <EditUserFormComponent />
    <div className="my-3 block border-b-2 border-riverbed-900" />
  </main>
);

export default UserSettingsPage;
