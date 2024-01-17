/** settings/security/pages.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Page that displays the forms for editing the security settings
 */
// Used components ------------------------------------------------------------
import { ChangePasswordForm } from '@/libs/feature-settings/ChangePasswordForm';
import { LogoutAllForm } from '@/libs/feature-settings/LogoutAllForm';
import { ResetPasswordForm } from '@/libs/feature-settings/ResetPasswordForm';

// Component ------------------------------------------------------------------
const SecuritySettingsPage = (): JSX.Element => (
  <main>
    <ChangePasswordForm />
    <div className="my-3 block border-b-2 border-riverbed-900" />
    <ResetPasswordForm />
    <div className="my-3 block border-b-2 border-riverbed-900" />
    <LogoutAllForm />
  </main>
);

export default SecuritySettingsPage;
