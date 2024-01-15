/** settings/user/page.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Page that handles the forms for editing the user settings
 */
// Libraries ------------------------------------------------------------------
// Used Components ------------------------------------------------------------
import { EditUserForm } from '@/libs/feature-settings/editUserForm';
import { ResendVerificationForm } from '@/libs/feature-settings/resendVerificationForm';

// Component ------------------------------------------------------------------
const UserSettingsPage = (): JSX.Element => {
  // Render -------------------------------------
  return (
    <main>
      <EditUserForm />
      <ResendVerificationForm />
      {/* TODO: Delete user button*/}
      <section data-testid="delete-user"></section>
    </main>
  );
};

export default UserSettingsPage;
