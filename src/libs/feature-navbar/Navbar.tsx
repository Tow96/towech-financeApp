/** Navbar.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Navbar feature of the app, allows to move between pages
 */
'use client';
// Libraries ------------------------------------------------------------------
import { redirect, usePathname } from 'next/navigation';
import { classNames } from '@/utils/ConditionalClasses';
// Hooks ----------------------------------------------------------------------
import { useEffect, useRef, useState } from 'react';
import { useLogout } from '@/libs/feature-authentication/UserService';
import { useNavStore } from '@/libs/feature-navbar/NavbarService';
// Used Components ------------------------------------------------------------
import { CSSTransition } from 'react-transition-group';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { NavbarItem } from './NavbarItem';

// Types ----------------------------------------------------------------------
type NavIcon = {
  name: string;
  href: string;
  icon: IconProp;
};
const links: NavIcon[] = [
  { name: 'Transactions', href: '/dashboard', icon: 'money-check-dollar' },
  { name: 'Settings', href: '/settings', icon: 'gear' },
];

// Component ------------------------------------------------------------------
export const Navbar = (): JSX.Element => {
  const path = usePathname();
  const { title } = useNavStore();

  // Logout -------------------------------------
  const { mutate: logout, status } = useLogout();
  useEffect(() => {
    if (status !== 'success') return;
    redirect('/login');
  }, [status]);

  // Collapse -----------------------------------
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  const sideBarClass = classNames({
    '!left-0': !collapsed,
    'button-shadow': !collapsed,
  });

  // Transitions --------------------------------
  const transitionNavRef = useRef(null);
  const transitionNavCls = {
    enter: 'sm:w-20',
    enterActive: 'transition-all sm:!w-96',
    enterDone: 'sm:w-96',
    exit: 'sm:w-96',
    exitActive: 'transition-all sm:!w-20',
    exitDone: 'sm:w-20',
  };

  // Render -------------------------------------
  return (
    <>
      {/* Menu */}
      <div className="flex sm:max-w-[5rem]">
        <CSSTransition
          nodeRef={transitionNavRef}
          timeout={100}
          in={!collapsed}
          classNames={transitionNavCls}>
          <nav
            ref={transitionNavRef}
            className="sm:button-shadow z-10 flex w-full flex-col bg-riverbed-800 sm:h-screen">
            {/* Toggle + header */}
            <div className="flex items-center">
              <NavbarItem
                type="button"
                icon="bars"
                name={collapsed ? 'Expand' : 'Close'}
                click={toggleCollapse}
                collapsed={collapsed}
              />
              <div className="sm:hidden">
                <h1 className="text-2xl font-bold">{title}</h1>
              </div>
            </div>
            {/* Contents */}
            <div
              className={`absolute -left-20 flex h-screen flex-grow flex-col bg-riverbed-800 sm:static ${sideBarClass}`}>
              {/* Top divider (desktop only) */}
              <div className="mx-3 mt-3 hidden border-b-2 border-riverbed-900 sm:block"></div>
              {/* Main contents */}
              <div className="flex-grow">
                {links.map((lk, i) => (
                  <NavbarItem
                    key={i}
                    type="link"
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    name={lk.name}
                    href={lk.href}
                    current={path}
                    icon={lk.icon}
                  />
                ))}
              </div>
              {/* Logout */}
              <div className="mx-3 mt-3 border-b-2 border-riverbed-900"></div>
              <div>
                <NavbarItem
                  icon={'right-from-bracket'}
                  type="button"
                  collapsed={collapsed}
                  name="Logout"
                  click={logout}
                />
              </div>
            </div>
          </nav>
        </CSSTransition>
      </div>
      {/* Dismiss Area */}
      <NavbarDismissArea collapsed={collapsed} setCollapsed={setCollapsed} />
    </>
  );
};
const NavbarDismissArea = (props: {
  collapsed: boolean;
  setCollapsed: (_: boolean) => void;
}): JSX.Element => {
  if (props.collapsed) return <></>;
  return (
    <div
      data-testid="dismiss-area"
      className="absolute h-screen w-full bg-transparent"
      onClick={() => props.setCollapsed(true)}></div>
  );
};
