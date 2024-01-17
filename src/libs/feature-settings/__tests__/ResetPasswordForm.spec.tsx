// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// Tested Components ----------------------------------------------------------
import { ResetPasswordForm } from '../ResetPasswordForm';

// Mocks ----------------------------------------------------------------------
const mockResetPass = jest.fn(() => ({ mutate: () => ({}), status: 'idle' }));
const mockToast = jest.fn();

jest.mock('../../feature-authentication/UserService', () => ({
  usePasswordReset: () => mockResetPass(),
}));
jest.mock('../../feature-toasts/ToastService', () => ({
  useAddToast: () => mockToast,
}));

// Tests ----------------------------------------------------------------------
describe('Password Reset', () => {
  describe('Render', () => {
    it('Should have a header indicating the form', () => {
      render(<ResetPasswordForm />);
      const title = screen.getByRole('heading');

      expect(title).toHaveTextContent('Forgotten Password');
    });
    it('Should have a Send password reset email button', () => {
      render(<ResetPasswordForm />);
      const saveBttn = screen.getByRole('button');

      expect(saveBttn).toHaveAttribute('type', 'button');
      expect(saveBttn).toHaveTextContent('Reset');
    });
  });
  describe('Behaviour', () => {
    it('Should call the hook if the button is clicked', async () => {
      const mutate = jest.fn();
      mockResetPass.mockImplementation(() => ({ mutate }) as any);

      render(<ResetPasswordForm />);
      const saveBttn = screen.getByRole('button');
      await userEvent.click(saveBttn);

      expect(mutate).toHaveBeenCalledTimes(1);
    });
    it('Should disable the button when the status is pending', () => {
      mockResetPass.mockImplementationOnce(() => ({ status: 'pending', isPending: true }) as any);
      render(<ResetPasswordForm />);
      const saveBttn = screen.getByRole('button');

      expect(saveBttn).toBeDisabled();
    });
    it('Should set the button to "loading" if the status is pending', () => {
      mockResetPass.mockImplementationOnce(() => ({ status: 'pending', isPending: true }) as any);
      render(<ResetPasswordForm />);
      const saveBttn = screen.getByRole('button');

      expect(saveBttn).toHaveAttribute('aria-busy', 'true');
    });
    it('Should add a success Toast if the call returns successful', () => {
      mockResetPass.mockImplementation(() => ({ status: 'success' }) as any);
      render(<ResetPasswordForm />);

      expect(mockToast).toHaveBeenCalledWith({ message: 'Email sent', type: 'success' });
    });
    it('Should add an error Toast if the call returns an error', () => {
      mockResetPass.mockImplementation(() => ({ status: 'error' }) as any);
      render(<ResetPasswordForm />);

      expect(mockToast).toHaveBeenCalledWith({
        message: expect.any(String),
        type: 'error',
      });
    });
  });
});
