/** settings/layout.tsx
 * Copyright (c) 2024, Towechlabs
 *
 * Layout for the settings pages
 * Contains the selector menu as well as the title changer
 */
'use client';
// Libraries ------------------------------------------------------------------

// Hooks ----------------------------------------------------------------------
import { useUpdateTitle } from '@/libs/feature-navbar/NavbarService';
import Link from 'next/link';
import { useEffect } from 'react';

// Used Components ------------------------------------------------------------

// Types ----------------------------------------------------------------------

// Component ------------------------------------------------------------------
const SettingsLayout = ({ children }: { children?: React.ReactNode }) => {
  // Title change ------------------------------
  const updateTitle = useUpdateTitle();
  useEffect(() => {
    updateTitle('Settings');
  }, [updateTitle]);

  // Render -------------------------------------
  return (
    <div className="mx-3 mt-6 flex-1 bg-riverbed-700">
      <div>
        <Link href="/settings/user">User</Link>
        <br />
        <Link href="/settings/security">Security</Link>
      </div>
      <div className="px-3">{children}</div>
    </div>
  );
};

export default SettingsLayout;
