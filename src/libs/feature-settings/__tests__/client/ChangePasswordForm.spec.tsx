// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// Tested Components ----------------------------------------------------------
import { ChangePasswordForm } from '@/libs/feature-settings/ChangePasswordForm';

// Mocks ----------------------------------------------------------------------
const mockChangePass = jest.fn(() => ({ mutate: () => ({}), status: 'idle' }));
const mockToast = jest.fn();

jest.mock('../../../feature-authentication/UserService', () => ({
  usePasswordChange: () => mockChangePass(),
}));
jest.mock('../../../feature-toasts/ToastService', () => ({
  useAddToast: () => mockToast,
}));

// Tests ----------------------------------------------------------------------
describe('Change Password Form', () => {
  describe('Render', () => {
    it('Should have a header indicating the form', () => {
      render(<ChangePasswordForm />);
      const title = screen.getByRole('heading');

      expect(title).toHaveTextContent('Change Password');
    });
    it('Should have three password inputs containing the old new and confirm password fields', () => {
      render(<ChangePasswordForm />);
      const oldInput = screen.getByLabelText('Old password');
      const newInput = screen.getByLabelText('New password');
      const confirmInput = screen.getByLabelText('Confirm new password');

      expect(oldInput).toBeInTheDocument();
      expect(oldInput).toHaveAttribute('type', 'password');
      expect(newInput).toBeInTheDocument();
      expect(newInput).toHaveAttribute('type', 'password');
      expect(confirmInput).toBeInTheDocument();
      expect(confirmInput).toHaveAttribute('type', 'password');
    });
    it('Should have a Save button', () => {
      render(<ChangePasswordForm />);
      const saveBttn = screen.getByRole('button');

      expect(saveBttn).toHaveAttribute('type', 'submit');
      expect(saveBttn).toHaveTextContent('Save');
    });
  });
  describe('Behaviour', () => {
    it('Should disable the Save button until all fields are populated', async () => {
      render(<ChangePasswordForm />);
      const saveBttn = screen.getByRole('button');
      const oldInput = screen.getByLabelText('Old password');
      const newInput = screen.getByLabelText('New password');
      const confirmInput = screen.getByLabelText('Confirm new password');

      await userEvent.clear(oldInput);
      await userEvent.clear(newInput);
      await userEvent.clear(confirmInput);
      expect(saveBttn).toBeDisabled();

      await userEvent.type(oldInput, 'old');
      await userEvent.clear(newInput);
      await userEvent.clear(confirmInput);
      expect(saveBttn).toBeDisabled();

      await userEvent.clear(oldInput);
      await userEvent.type(newInput, 'new');
      await userEvent.clear(confirmInput);
      expect(saveBttn).toBeDisabled();

      await userEvent.clear(oldInput);
      await userEvent.clear(newInput);
      await userEvent.type(confirmInput, 'new');
      expect(saveBttn).toBeDisabled();

      await userEvent.type(oldInput, 'old');
      await userEvent.type(newInput, 'new');
      await userEvent.clear(confirmInput);
      expect(saveBttn).toBeDisabled();

      await userEvent.type(oldInput, 'old');
      await userEvent.clear(newInput);
      await userEvent.type(confirmInput, 'new');
      expect(saveBttn).toBeDisabled();

      await userEvent.clear(oldInput);
      await userEvent.type(newInput, 'new');
      await userEvent.type(confirmInput, 'new');
      expect(saveBttn).toBeDisabled();

      await userEvent.type(oldInput, 'old');
      await userEvent.type(newInput, 'new');
      await userEvent.type(confirmInput, 'new');
      expect(saveBttn).toBeEnabled();
    });
    it('Should send the params when save is clicked', async () => {
      const mutate = jest.fn();
      mockChangePass.mockImplementation(() => ({ mutate }) as any);

      render(<ChangePasswordForm />);
      const saveBttn = screen.getByRole('button');
      const oldInput = screen.getByLabelText('Old password');
      const newInput = screen.getByLabelText('New password');
      const confirmInput = screen.getByLabelText('Confirm new password');

      await userEvent.type(oldInput, 'old');
      await userEvent.type(newInput, 'new');
      await userEvent.type(confirmInput, 'confirm');
      await userEvent.click(saveBttn);

      expect(mutate).toHaveBeenCalledWith({
        oldPassword: 'old',
        newPassword: 'new',
        confirmPassword: 'confirm',
      });
    });
    it('Should disable the inputs and button if the status is pending', () => {
      mockChangePass.mockImplementationOnce(() => ({ status: 'pending', isPending: true }) as any);

      render(<ChangePasswordForm />);
      const oldInput = screen.getByLabelText('Old password');
      const newInput = screen.getByLabelText('New password');
      const confirmInput = screen.getByLabelText('Confirm new password');
      const saveBttn = screen.getByRole('button');

      expect(oldInput).toBeDisabled();
      expect(newInput).toBeDisabled();
      expect(confirmInput).toBeDisabled();
      expect(saveBttn).toBeDisabled();
    });
    it('Should add a success Toast if the call returns successful', () => {
      mockChangePass.mockImplementation(() => ({ status: 'success' }) as any);
      render(<ChangePasswordForm />);

      expect(mockToast).toHaveBeenCalledWith({
        message: 'Password updated',
        type: 'success',
      });
    });
    it('Should set the button to "loading" if the status is pending', () => {
      mockChangePass.mockImplementationOnce(() => ({ status: 'pending', isPending: true }) as any);
      render(<ChangePasswordForm />);
      const saveBttn = screen.getByRole('button');

      expect(saveBttn).toHaveAttribute('aria-busy', 'true');
    });
    it('Should add an error Toast if the call returns an error', () => {
      mockChangePass.mockImplementation(() => ({ status: 'error' }) as any);
      render(<ChangePasswordForm />);

      expect(mockToast).toHaveBeenCalledWith({
        message: expect.any(String),
        type: 'error',
      });
    });
  });
});
