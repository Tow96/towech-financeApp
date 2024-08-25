/** ChangePasswordForm.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Component used to change the password, it is a modal
 */
import React, { useContext, useState } from 'react';
import * as FaIcons from 'react-icons/fa';

// Components
import Input from '../../Components/Input';
import Modal from '../../Components/Modal';

// Hooks
import { MainStore } from '../../Hooks/ContextStore';
import UseForm from '../../Hooks/UseForm';

// Services
import UserService from '../../Services/UserService';

// Utilities
import CheckNested from '../../Utils/CheckNested';

interface Props {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  resultState: () => void;
}

const ChangePasswordForm = (props: Props): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken } = useContext(MainStore);

  // Starts the services
  const userService = new UserService(authToken, dispatchAuthToken);

  // Hooks
  const [errors, setErrors] = useState({} as any);

  const changePasswordForm = UseForm(changePasswordCallback, {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const acceptIcon = <FaIcons.FaSave />;

  // Functions
  async function changePasswordCallback() {
    try {
      // If the name is blank or unedited, just closes the modal
      await userService.changePassword(changePasswordForm.values);

      props.setState(false);
    } catch (err: any) {
      if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      else console.log(err); //eslint-disable-line no-console
    }
  }

  function clearModal() {
    changePasswordForm.clear();
    setErrors([]);
  }

  return (
    <Modal
      showModal={props.state}
      setModal={props.setState}
      title={'Change password'}
      accept={acceptIcon}
      onAccept={changePasswordCallback}
      onClose={clearModal}
    >
      <form onSubmit={changePasswordForm.onSubmit}>
        <Input
          error={errors.password ? true : false}
          label="Old password"
          name="oldPassword"
          type="password"
          value={changePasswordForm.values.oldPassword}
          onChange={changePasswordForm.onChange}
        />
        <Input
          error={errors.confirmPassword ? true : false}
          label="New password"
          name="newPassword"
          type="password"
          value={changePasswordForm.values.newPassword}
          onChange={changePasswordForm.onChange}
        />
        <Input
          error={errors.confirmPassword ? true : false}
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          value={changePasswordForm.values.confirmPassword}
          onChange={changePasswordForm.onChange}
        />
      </form>
    </Modal>
  );
};

export default ChangePasswordForm;
