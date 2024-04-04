// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as UserService from '@/libs/feature-authentication/UserService';
import * as ToastService from '@/libs/feature-toasts/ToastService';
import * as Navigation from 'next/navigation';
// Tested Components ----------------------------------------------------------
import LoginPage from '@/app/(no-auth-routes)/login/page';

// Stubs ----------------------------------------------------------------------

// Mocks ----------------------------------------------------------------------
jest.mock('../../../../libs/feature-authentication/UserService.ts', () => ({
  useLogin: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
jest.mock('../../../../libs/feature-toasts/ToastService', () => ({
  useAddToast: jest.fn(),
}));
const mockUseLogin = jest.spyOn(UserService, 'useLogin');
const mockAddToast = jest.spyOn(ToastService, 'useAddToast');
const mockRedirect = jest.spyOn(Navigation, 'redirect');

// Tests ----------------------------------------------------------------------
describe('Login Page', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockUseLogin.mockImplementation(() => ({ mutate: () => ({}) }) as any);
    mockAddToast.mockImplementation(() => () => {});
  });
  describe('Render', () => {
    it('should have the correct title', () => {
      render(<LoginPage />);

      const title = screen.getByRole('heading');

      expect(title).toHaveTextContent('Login');
    });
    it('should have the Email, password and keep session inputs', () => {
      render(<LoginPage />);

      const usernameIn = screen.getByLabelText('Email');
      const passwordIn = screen.getByLabelText('Password');
      const keepSessionIn = screen.getByLabelText('Keep Session');

      expect(usernameIn).toBeInTheDocument();
      expect(passwordIn).toBeInTheDocument();
      expect(keepSessionIn).toBeInTheDocument();
    });
    it('should have a Login button', () => {
      render(<LoginPage />);

      const submitBttn = screen.getByRole('button');

      expect(submitBttn).toHaveTextContent('Login');
    });
  });
  describe('Behaviour', () => {
    it('should call the useLogin fn with filled data', async () => {
      const mail = 'pesto@mail.com';
      const pass = 'pass';
      const mutate = jest.fn();

      mockUseLogin.mockImplementation(() => ({ mutate }) as any);
      render(<LoginPage />);
      const usernameIn = screen.getByLabelText('Email');
      const passwordIn = screen.getByLabelText('Password');
      const keepSessionIn = screen.getByLabelText('Keep Session');
      const submitBttn = screen.getByRole('button');

      await userEvent.type(usernameIn, mail);
      await userEvent.type(passwordIn, pass);
      await userEvent.click(keepSessionIn);

      await userEvent.click(submitBttn);
      expect(mutate).toHaveBeenCalledWith({
        email: mail,
        password: pass,
        keepSession: true,
      });
    });
    it('should redirect to the dashboard when login is successful', () => {
      mockUseLogin.mockImplementation(() => ({ status: 'success' }) as any);
      render(<LoginPage />);

      expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
    });
    it('should set the form inputs as erroneous when login is unsuccessful', () => {
      mockUseLogin.mockImplementation(() => ({ status: 'error' }) as any);
      render(<LoginPage />);

      const usernameIn = screen.getByLabelText('Email');
      const passwordIn = screen.getByLabelText('Password');

      expect(usernameIn).toHaveClass('focus-visible:focused-input-error');
      expect(passwordIn).toHaveClass('focus-visible:focused-input-error');
    });
    it('should display an error toast giving the reasons for the log in failure', () => {
      const mockToast = jest.fn();
      mockUseLogin.mockImplementation(() => ({ status: 'error' }) as any);
      mockAddToast.mockImplementation(() => mockToast);

      render(<LoginPage />);
      expect(mockToast).toHaveBeenCalledWith({ message: expect.any(String), type: 'error' });
    });
  });
});
