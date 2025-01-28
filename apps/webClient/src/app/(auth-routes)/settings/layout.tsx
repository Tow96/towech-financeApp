import { ReactElement, ReactNode } from 'react';
import { Metadata } from 'next';
import { SettingsMenu } from '@financeapp/frontend-settings';

export const metadata: Metadata = {
  title: 'Settings',
};

const SettingsLayout = ({ children }: { children: ReactNode }): ReactElement => (
  <div className="flex flex-1 items-center justify-center px-6 pt-10 sm:p-4">
    <div className="bg-riverbed-700 max-w-[60rem] flex flex-1 flex-col h-full rounded-t-3xl overflow-hidden shadow-lg sm:flex-row sm:rounded-3xl md:h-[30rem] short:h-full">
      <SettingsMenu />
      <div className="h-full flex-1 overflow-auto p-3">{children}</div>
    </div>
  </div>
);

export default SettingsLayout;
