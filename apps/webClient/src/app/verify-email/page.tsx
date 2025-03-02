import { ReactElement } from 'react';
// Components
import { VerifyUserFormComponent } from '@financeapp/frontend-users';

const VerifyEmailPage = (): ReactElement => {
  return (
    <main className="mt-12 flex justify-center">
      <VerifyUserFormComponent />
    </main>
  );
};

export default VerifyEmailPage;
