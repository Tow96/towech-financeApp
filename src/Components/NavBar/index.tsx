/** NavBar.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * Navigation bar component
 */
'use client';
import { useContext, useRef, useState } from 'react';
import * as FaIcons from 'react-icons/fa';

// Hooks
import { MainStore } from '../../Hooks/ContextStore';

// Services
import AuthenticationService from '../../Services/AuthenticationService';

// Styles
import './NavBar.css';
import MenuItem from './MenuItem';

interface Props {
  selected?: string;
}

const NavBar = (props: Props): JSX.Element => {
  // Context
  const { dispatchAuthToken } = useContext(MainStore);

  // Starts the services
  const authService = new AuthenticationService();

  // Hooks
  const [sidebar, setSidebar] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Callbacks
  async function logoutCallback() {
    try {
      await authService.logout();
    } catch (err) {
      // console.log(err);
    }

    dispatchAuthToken({ type: 'LOGOUT', payload: { token: '' } });
  }

  return (
    <div className="navBar">
      {/* Menu bar*/}
      <div className="navBar__selector" onClick={() => setSidebar(true)}>
        <FaIcons.FaBars />
      </div>
      {/*Navigation bar*/}
      <div className={sidebar ? 'navBar__outside active' : 'navBar__outside'} onClick={() => setSidebar(false)}>
        <nav ref={menuRef} className="navBar__Menu">
          <div></div>
          <MenuItem
            link="/home"
            label="Transactions"
            onClick={() => setSidebar(false)}
            selected={props.selected === 'Transactions'}
          >
            <FaIcons.FaMoneyCheckAlt />
          </MenuItem>
          <MenuItem
            link="/wallets"
            label="Wallets"
            onClick={() => setSidebar(false)}
            selected={props.selected === 'Wallets'}
          >
            <FaIcons.FaWallet />
          </MenuItem>
          {/* <MenuItem
            link="/categories"
            label="Categories"
            onClick={() => setSidebar(false)}
            selected={props.selected === 'Categories'}
          >
            <FaIcons.FaCubes />
          </MenuItem> */}
          <MenuItem
            link="/settings"
            label="Settings"
            onClick={() => setSidebar(false)}
            selected={props.selected === 'Settings'}
          >
            <FaIcons.FaCog />
          </MenuItem>
          <MenuItem label="Log-out" onClick={logoutCallback}>
            <FaIcons.FaUserTimes />
          </MenuItem>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
