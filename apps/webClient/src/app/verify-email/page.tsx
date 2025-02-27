import { ReactElement } from 'react';
// Components
import { VerifyUserFormComponent } from '@financeapp/frontend-users';

const VerifyEmailPage = (): ReactElement => {
  return (
    <main className="mt-12 flex justify-center">
      <section className="bg-riverbed-700 w-[31rem] rounded-3xl p-6">
        <VerifyUserFormComponent />
      </section>
    </main>
  );
};

export default VerifyEmailPage;
