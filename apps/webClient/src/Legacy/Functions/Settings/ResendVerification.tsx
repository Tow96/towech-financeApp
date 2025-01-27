/** ResendVerification.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 *
 * Component that notifies the user of the sending of the mail, it is a modal
 */
import React, { useContext, useEffect, useState } from 'react';

// Components
import Modal from '../../Components/Modal';

// Hooks
import { MainStore } from '../../Hooks/ContextStore';

// Services
import UserService from '../../Services/UserService';

interface Props {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResendVerification = (props: Props): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken } = useContext(MainStore);

  // Starts the services
  const userService = new UserService(authToken, dispatchAuthToken);

  // Hooks
  const [errors, setErrors] = useState({} as any);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (props.state == true) {
      userService
        .resendVerificationEmail()
        .then(() => {
          setSent(true);
          setErrors({});
        })
        .catch((e: any) => {
          setErrors(e);
          setSent(false);
        });
    }
  }, [props.state]);

  return (
    <Modal
      showModal={props.state}
      setModal={props.setState}
      title={'Resend verification mail'}
      accept={'OK'}
    >
      <div>
        {sent && 'The email verification has been sent'}
        {Object.keys(errors).length > 0 && (
          <div className="ui error message">
            <ul className="list">
              {Object.values(errors).map((value: any) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ResendVerification;
