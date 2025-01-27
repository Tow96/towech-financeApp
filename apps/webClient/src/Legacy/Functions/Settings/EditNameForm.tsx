/** EditNameForm.tsx
 * Copyright (c) 2021, Jose Tow
 * All rights reserved
 *
 * Component used to edit the username, it is a modal
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

const EditNameForm = (props: Props): JSX.Element => {
  // Context
  const { authToken, dispatchAuthToken } = useContext(MainStore);

  // Starts the services
  const userService = new UserService(authToken, dispatchAuthToken);

  // Hooks
  const [errors, setErrors] = useState({} as any);

  const editNameForm = UseForm(editNameCallback, {
    name: authToken.name || '',
  });

  const acceptIcon = <FaIcons.FaSave />;

  // Functions
  async function editNameCallback() {
    try {
      // If the name is blank or unedited, just closes the modal
      if (
        editNameForm.values.name.trim() === '' ||
        editNameForm.values.name.trim() === authToken.name
      ) {
        clearModal();
        props.setState(false);
        return;
      }

      // Sends the edit to the API
      const res = await userService.editUser(authToken._id, editNameForm.values);

      props.setState(false);

      if (res.status !== 304) props.resultState();
    } catch (err: any) {
      if (CheckNested(err, 'response', 'data', 'errors')) setErrors(err.response.data.errors);
      else console.log(err); //eslint-disable-line no-console
    }
  }

  function clearModal() {
    editNameForm.clear();
    setErrors([]);
  }

  return (
    <Modal
      showModal={props.state}
      setModal={props.setState}
      title={'Change Name'}
      accept={acceptIcon}
      onAccept={editNameCallback}
      onClose={clearModal}
    >
      <form onSubmit={editNameForm.onSubmit}>
        <Input
          error={errors.name ? true : false}
          label="Name"
          name="name"
          type="text"
          value={editNameForm.values.name}
          onChange={editNameForm.onChange}
        />
      </form>
    </Modal>
  );
};

export default EditNameForm;
