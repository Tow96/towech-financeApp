/** login/page.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Page that handles the login form
 */
'use client';
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { redirect } from 'next/navigation';

import { Checkbox } from '@/components/checkbox';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { useLogin } from '@/libs/feature-authentication/UserService';

type Inputs = {
  username: string;
  password: string;
  keepSession: boolean;
};

const LoginPage = (): JSX.Element => {
  const { mutate: login, status } = useLogin();

  const form = useForm<Inputs>();
  const formErrors = form.formState.errors;

  const onSubmit: SubmitHandler<Inputs> = data => login(data);
  useEffect(() => {
    switch (status) {
      case 'error':
        form.setError('username', { type: 'validate' });
        form.setError('password', { type: 'validate' });
        break;
      case 'success':
        redirect('/dashboard');
    }
  }, [status, form]);

  return (
    <main className="mt-12 flex justify-center ">
      <section className="w-[31rem] rounded-3xl bg-riverbed-700 p-6">
        {/* Title */}
        <h1 className="text-4xl font-extrabold">Login</h1>
        {/* Login Form */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Input
            label="Email"
            error={formErrors.username !== undefined}
            register={form.register('username', { required: true })}
          />
          <Input
            type="password"
            label="Password"
            error={formErrors.password !== undefined}
            register={form.register('password', { required: true })}
          />
          {/* Keep session + submit */}
          <div className="flex justify-between px-1">
            <Checkbox label="Keep Session" register={form.register('keepSession')} />
            <Button type="submit">Login</Button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
