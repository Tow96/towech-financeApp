'use client';
import { ReactElement } from 'react';
import { useEditUserForm } from './EditUser.Hook';

// Components
import { Button, Input } from '@financeapp/frontend-common';

export const EditUserFormComponent = (): ReactElement => {
  const form = useEditUserForm();

  return (
    <section>
      <h2 className="text-2xl">Change User</h2>
      <form onSubmit={form.onSubmit}>
        <div className="justify-around gap-2 md:flex">
          <Input label="Name" disabled={form.isPending} register={form.registerName} />
          <Input label="Email" disabled={form.isPending} register={form.registerEmail} />
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={form.isPending} disabled={!form.isValid || form.isPending}>
            Save
          </Button>
        </div>
      </form>
    </section>
  );
};
