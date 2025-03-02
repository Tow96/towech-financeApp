'use client';
// Libraries ------------------------------------------------------------------
import { ReactElement } from 'react';
import { redirect } from 'next/navigation';
// Hooks ----------------------------------------------------------------------
import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LoginDto, useLogin } from '@financeapp/frontend-authentication';
import { useAddToast } from '@financeapp/frontend-toasts';
// Used Components ------------------------------------------------------------
import { Button, Checkbox, Input } from '@financeapp/frontend-common';

const LoginPage = (): ReactElement => {
  // Toasts -------------------------------------
  const addToast = useAddToast();

  // Form ---------------------------------------
  const form = useForm<LoginDto>();
  const formErrors = form.formState.errors;
  const onSubmit: SubmitHandler<LoginDto> = (data) => loginMutator(data);

  // Login --------------------------------------
  const { mutate: loginMutator, status, error } = useLogin();
  // Set error in the form
  useEffect(() => {
    if (status === 'error') {
      form.setError('email', { type: 'validate' });
      form.setError('password', { type: 'validate' });
    }
  }, [status, form]);
  // Generate toast
  useEffect(() => {
    if (status === 'error') {
      addToast({ message: error?.message || 'Error', type: 'error' });
    }
  }, [status, addToast, error]);
  // Redirect to dashboard
  useEffect(() => {
    if (status === 'success') redirect('/dashboard');
  }, [status]);

  // Render -------------------------------------
  return (
    <main className="mt-12 flex justify-center">
      <section className="bg-riverbed-700 w-[31rem] rounded-3xl p-6">
        {/* Title */}
        <h1 className="text-4xl font-extrabold">Login</h1>
        {/* Login Form */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Input
            label="Email"
            error={formErrors.email !== undefined}
            register={form.register('email', { required: true })}
          />
          <Input
            type="password"
            label="Password"
            error={formErrors.password !== undefined}
            register={form.register('password', { required: true })}
          />
          {/* Keep session + submit */}
          <div className="flex justify-between px-1 pt-2">
            <Checkbox label="Keep Session" register={form.register('keepSession')} />
            <Button type="submit" text="Login" />
          </div>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
