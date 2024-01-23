// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { User } from '@/libs/feature-authentication/UserService';
// Tested Components ----------------------------------------------------------
import { ResendVerificationForm } from '../ResendVerificationForm';

// Stubs ----------------------------------------------------------------------
const stubUser: User = {
  name: 'test',
  username: 'testuser@provider.com',
  _id: 'ffffffffffffffffffffffff',
  role: 'user',
  accountConfirmed: true,
  exp: 0,
  iat: 0,
  token: 'token',
};

// Mocks ----------------------------------------------------------------------
const mockToast = jest.fn();
const mockAuth = jest.fn(() => ({ data: stubUser, status: 'success' }));
const mockResendMail = jest.fn(() => ({ mutate: () => ({}), status: 'idle' }));

jest.mock('../../feature-authentication/UserService', () => ({
  useAuth: () => mockAuth(),
  useResendMail: () => mockResendMail(),
}));
jest.mock('../../feature-toasts/ToastService', () => ({
  useAddToast: () => mockToast,
}));

// Tests ----------------------------------------------------------------------
describe('Email Verification', () => {
  describe('Render', () => {
    it('should render a header indicating the status of the account', () => {
      render(<ResendVerificationForm />);
      const title = screen.getByRole('heading');

      expect(title).toHaveTextContent('Email status:');
    });
    it('should have a text saying Verified if the account is confirmed', () => {
      render(<ResendVerificationForm />);
      const caption = screen.getByRole('caption');

      expect(caption).toHaveTextContent('Verified');
    });
    it('Should not render any button when the account is confirmed', () => {
      render(<ResendVerificationForm />);
      expect(() => screen.getAllByRole('button')).toThrow();
    });
    it('should have a text saying Unverified if the account is confirmed', () => {
      mockAuth.mockImplementation(() => ({
        data: { ...stubUser, accountConfirmed: false },
        status: 'success',
      }));
      render(<ResendVerificationForm />);
      const caption = screen.getByRole('caption');

      expect(caption).toHaveTextContent('Unverified');
    });
    it('Should render a Resend Verification email button when the account is not confirmed', () => {
      mockAuth.mockImplementation(
        () => ({ data: { ...stubUser, accountConfirmed: false }, status: 'success' }) as any
      );
      render(<ResendVerificationForm />);
      const resendBttn = screen.getByRole('button');

      expect(resendBttn).toHaveAttribute('type', 'button');
      expect(resendBttn).toHaveTextContent('Resend email');
    });
  });
  describe('Behaviour', () => {
    it('Should call the resendEmail hook when the resend verification button is clicked', async () => {
      const mutate = jest.fn();
      mockResendMail.mockImplementation(() => ({ mutate }) as any);
      mockAuth.mockImplementation(() => ({
        data: { ...stubUser, accountConfirmed: false },
        status: 'success',
      }));
      render(<ResendVerificationForm />);

      const resendBttn = screen.getByRole('button');
      await userEvent.click(resendBttn);

      expect(mutate).toHaveBeenCalledTimes(1);
    });
    it('Should disable the button when the status is pending', () => {
      mockAuth.mockImplementation(() => ({
        data: { ...stubUser, accountConfirmed: false },
        status: 'success',
      }));
      mockResendMail.mockImplementation(() => ({ status: 'pending', isPending: true }) as any);
      render(<ResendVerificationForm />);

      const resendBttn = screen.getByRole('button');

      expect(resendBttn).toBeDisabled();
    });
    it('Should set the button as "loading" if the status is pending', () => {
      mockAuth.mockImplementation(() => ({
        data: { ...stubUser, accountConfirmed: false },
        status: 'success',
      }));
      mockResendMail.mockImplementation(() => ({ status: 'pending', isPending: true }) as any);
      render(<ResendVerificationForm />);

      const resendBttn = screen.getByRole('button');

      expect(resendBttn).toHaveAttribute('aria-busy', 'true');
    });
    it('Should add a success Toast if the call returns successful', () => {
      mockResendMail.mockImplementation(() => ({ status: 'success' }) as any);
      render(<ResendVerificationForm />);

      expect(mockToast).toHaveBeenCalledWith({
        message: 'Email sent',
        type: 'success',
      });
    });
    it('Should add an error Toast if the call returns an error', () => {
      mockResendMail.mockImplementation(() => ({ status: 'error' }) as any);
      render(<ResendVerificationForm />);

      expect(mockToast).toHaveBeenCalledWith({
        message: expect.any(String),
        type: 'error',
      });
    });
  });
});