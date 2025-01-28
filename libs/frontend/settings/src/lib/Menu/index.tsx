import { ReactElement } from 'react';
import { SettingsMenuItem } from './Item.Component';

export const SettingsMenu = (): ReactElement => (
  <nav className="overflow-hidden flex justify-around bg-riverbed-800 sm:w-28 sm:flex-col sm:justify-normal md:w-36 shadow-md">
    <SettingsMenuItem icon="user" name="User" href="user" />
    <SettingsMenuItem icon="lock" name="Security" href="security" />
    <SettingsMenuItem icon="users" name="Manage Users" href="manage-users" />
  </nav>
);
