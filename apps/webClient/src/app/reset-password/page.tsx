import { ReactElement } from 'react';
import { ResetPasswordFormComponent } from '@financeapp/frontend-users';

const ResetPasswordPage = (): ReactElement => {
  return (
    <main className="mt-12 flex justify-center">
      <ResetPasswordFormComponent />
    </main>
  );
};

export default ResetPasswordPage;
