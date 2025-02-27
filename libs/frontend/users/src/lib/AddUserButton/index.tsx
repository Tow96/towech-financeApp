import { Button, Input, Modal } from '@financeapp/frontend-common';
import { ReactElement } from 'react';
import { useAddUserForm } from './AddUserForm.Hook';

export const AddUserButton = (): ReactElement => {
  const modalParam = 'show-add-user';
  const form = useAddUserForm(modalParam);

  return (
    <>
      <Button icon="user-plus" text="Add User" onClick={form.open} />
      <Modal title="Add User" param={modalParam} onOk={form.submit}>
        <Input label="Name" register={form.fields.name.register} error={form.fields.name.error} />
        <Input
          label="Email"
          register={form.fields.email.register}
          error={form.fields.email.error}
        />
        <Input
          label="Password"
          type="password"
          register={form.fields.password.register}
          error={form.fields.password.error}
        />
      </Modal>
    </>
  );
};
