/** settings/layout.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Layout for the settings pages
 * Contains the selector menu as well as the title changer
 */
// Libraries ------------------------------------------------------------------
import { Metadata } from 'next';
// Used Components ------------------------------------------------------------
import { SettingsMenuItem } from '@/libs/feature-settings/MenuItem';

// Component ------------------------------------------------------------------
export const metadata: Metadata = {
  title: 'Settings',
};

const SettingsLayout = ({ children }: { children?: React.ReactNode }) => {
  // Render -------------------------------------
  return (
    <div className="flex flex-1 items-center justify-center px-6 pt-10 sm:p-4">
      <div className="short:h-full flex h-full max-w-[60rem] flex-1 flex-col bg-riverbed-700 sm:flex-row md:h-[30rem]">
        <SettingsMenu />
        <div className="h-full flex-1 overflow-auto px-3">{children}</div>
      </div>
    </div>
  );
};

export default SettingsLayout;

const SettingsMenu = (): JSX.Element => (
  <nav className=" flex justify-around bg-riverbed-800 sm:w-28 sm:flex-col sm:justify-normal">
    <SettingsMenuItem icon="user" name="User" href="user" />
    <SettingsMenuItem icon="lock" name="Security" href="security" />
    <SettingsMenuItem icon="users" name="Manage" href="manageusers" />
  </nav>
);
