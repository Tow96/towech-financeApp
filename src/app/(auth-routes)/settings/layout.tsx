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
  return <>{children}</>;
};

export default SettingsLayout;
