/** Logout.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Component used to logout from all devices, it is a modal
 */
import React, { useContext } from 'react';

// Components
import Modal from '../../Components/Modal';

// Hooks
import { MainStore } from '../../Hooks/ContextStore';

// Services
import AuthService from '../../Services/AuthenticationService';

interface Props {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogoutAll = (props: Props): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken } = useContext(MainStore);

  // Starts the services
  const authService = new AuthService(authToken, dispatchAuthToken);

  const runLogout = async (): Promise<void> => {
    props.setState(false);

    try {
      await authService.logoutAll();
    } catch (err) {
      // console.log(err);
    }

    dispatchAuthToken({ type: 'LOGOUT', payload: { token: '' } });
  };

  return (
    <Modal
      float
      showModal={props.state}
      setModal={props.setState}
      title={'Logout from all devices'}
      accept={'Logout'}
      onAccept={runLogout}
    >
      <div className="Settings__EditName__Modal__Text">Are you sure you want to logout from all devices?</div>
    </Modal>
  );
};

export default LogoutAll;
