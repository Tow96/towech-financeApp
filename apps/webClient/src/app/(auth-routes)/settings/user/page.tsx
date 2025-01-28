import { ReactElement } from 'react';
// Components
import { EditUserFormComponent, VerifyUserComponent } from '@financeapp/frontend-settings';

const UserSettingsPage = (): ReactElement => (
  <main>
    <EditUserFormComponent />
    <div className="my-3 block border-b-2 border-riverbed-900" />
    <VerifyUserComponent />
    <div className="my-3 block border-b-2 border-riverbed-900" />
    <section data-testid="delete-user">TODO: Delete user button</section>
  </main>
);

export default UserSettingsPage;
