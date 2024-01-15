// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as UserService from '@/libs/feature-authentication/UserService';
import * as ToastService from '@/libs/feature-toasts/ToastService';
import * as Navigation from 'next/navigation';
// Tested Components ----------------------------------------------------------
import SecuritySettingsPage from '@/app/(auth-routes)/settings/security/page';

// Stubs ----------------------------------------------------------------------
const stubUser: UserService.User = {
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
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
  redirect: jest.fn(),
}));
jest.mock('../../../../libs/feature-authentication/UserService', () => ({
  useAuth: jest.fn(),
  usePasswordChange: jest.fn(),
  usePasswordReset: jest.fn(),
  useGlobalLogout: jest.fn(),
}));
jest.mock('../../../../libs/feature-toasts/ToastService', () => ({
  useAddToast: jest.fn(),
}));
const mockUseAuth = jest.spyOn(UserService, 'useAuth');
const mockUsePassChange = jest.spyOn(UserService, 'usePasswordChange');
const mockUsePassReset = jest.spyOn(UserService, 'usePasswordReset');
const mockAddToast = jest.spyOn(ToastService, 'useAddToast');
const mockRouter = jest.spyOn(Navigation, 'useRouter');
const mockPath = jest.spyOn(Navigation, 'usePathname');
const mockParams = jest.spyOn(Navigation, 'useSearchParams');
const mockGlobalLogout = jest.spyOn(UserService, 'useGlobalLogout');

// Tests ----------------------------------------------------------------------
describe('Security Settings Page', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockAddToast.mockImplementation(() => () => {});
    mockUseAuth.mockImplementation(() => ({ data: stubUser, status: 'success' }) as any);
    mockUsePassChange.mockImplementation(() => ({ mutate: () => ({}) }) as any);
    mockUsePassReset.mockImplementation(() => ({ mutate: () => ({}) }) as any);
    mockGlobalLogout.mockImplementation(() => ({ mutate: () => ({}) }) as any);
    mockRouter.mockImplementation(() => ({ route: '/' }) as any);
    mockPath.mockImplementation(() => '/');
    mockParams.mockImplementation(() => ({}) as any);
  });

  describe('Change Password Form', () => {
    describe('Render', () => {
      it('Should have a header indicating the form', () => {
        render(<SecuritySettingsPage />);
        const passForm = screen.getByTestId('pass-form');

        const title = within(passForm).getByRole('heading');

        expect(title).toHaveTextContent('Change Password');
      });
      it('Should have three password inputs containing the old new and confirm password fields', () => {
        render(<SecuritySettingsPage />);
        const passForm = screen.getByTestId('pass-form');

        const oldInput = within(passForm).getByLabelText('Old password');
        const newInput = within(passForm).getByLabelText('New password');
        const confirmInput = within(passForm).getByLabelText('Confirm new password');

        expect(oldInput).toBeInTheDocument();
        expect(oldInput).toHaveAttribute('type', 'password');
        expect(newInput).toBeInTheDocument();
        expect(newInput).toHaveAttribute('type', 'password');
        expect(confirmInput).toBeInTheDocument();
        expect(confirmInput).toHaveAttribute('type', 'password');
      });
      it('Should have a Save button', () => {
        render(<SecuritySettingsPage />);
        const passForm = screen.getByTestId('pass-form');

        const saveBttn = within(passForm).getByRole('button');

        expect(saveBttn).toHaveAttribute('type', 'submit');
        expect(saveBttn).toHaveTextContent('Save');
      });
      it('Should render a spinner if the status is pending', () => {
        mockUsePassChange.mockImplementation(() => ({ status: 'pending' }) as any);
        render(<SecuritySettingsPage />);
        const passForm = screen.getByTestId('pass-form');
        const spinner = within(passForm).getByRole('status');
        expect(spinner).toBeInTheDocument();
      });
      it('Should not render a spinner if the status is not pending', () => {
        mockUsePassChange.mockImplementation(() => ({ status: 'idle' }) as any);
        render(<SecuritySettingsPage />);
        const passForm = screen.getByTestId('pass-form');
        expect(() => within(passForm).getByRole('status')).toThrow();
      });
    });
    describe('Behaviour', () => {
      it('Should disable the Save button until all fields are populated', async () => {
        render(<SecuritySettingsPage />);
        const passForm = screen.getByTestId('pass-form');

        const saveBttn = within(passForm).getByRole('button');
        const oldInput = within(passForm).getByLabelText('Old password');
        const newInput = within(passForm).getByLabelText('New password');
        const confirmInput = within(passForm).getByLabelText('Confirm new password');

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
        mockUsePassChange.mockImplementation(() => ({ mutate }) as any);

        render(<SecuritySettingsPage />);
        const passForm = screen.getByTestId('pass-form');

        const saveBttn = within(passForm).getByRole('button');
        const oldInput = within(passForm).getByLabelText('Old password');
        const newInput = within(passForm).getByLabelText('New password');
        const confirmInput = within(passForm).getByLabelText('Confirm new password');

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
      it('Should add a success Toast if the call returns successful', () => {
        const mockToast = jest.fn();
        mockUsePassChange.mockImplementation(() => ({ status: 'success' }) as any);
        mockAddToast.mockImplementation(() => mockToast);

        render(<SecuritySettingsPage />);

        expect(mockToast).toHaveBeenCalledWith({
          message: 'Password updated',
          type: 'success',
        });
      });
      it('Should add an error Toast if the call returns an error', () => {
        const mockToast = jest.fn();
        mockUsePassChange.mockImplementation(() => ({ status: 'error' }) as any);
        mockAddToast.mockImplementation(() => mockToast);

        render(<SecuritySettingsPage />);

        expect(mockToast).toHaveBeenCalledWith({
          message: expect.any(String),
          type: 'error',
        });
      });
    });
  });

  describe('Password Reset', () => {
    describe('Render', () => {
      it('Should have a header indicating the form', () => {
        render(<SecuritySettingsPage />);
        const resetForm = screen.getByTestId('reset-form');

        const title = within(resetForm).getByRole('heading');

        expect(title).toHaveTextContent('Forgotten Password');
      });
      it('Should have a Send password reset email button', () => {
        render(<SecuritySettingsPage />);
        const passForm = screen.getByTestId('reset-form');

        const saveBttn = within(passForm).getByRole('button');

        expect(saveBttn).toHaveAttribute('type', 'button');
        expect(saveBttn).toHaveTextContent('Send reset email');
      });
    });
    describe('Behaviour', () => {
      it('Should call the hook if the button is clicked', async () => {
        const mutate = jest.fn();
        mockUsePassReset.mockImplementation(() => ({ mutate }) as any);

        render(<SecuritySettingsPage />);
        const passForm = screen.getByTestId('reset-form');

        const saveBttn = within(passForm).getByRole('button');
        await userEvent.click(saveBttn);

        expect(mutate).toHaveBeenCalledTimes(1);
      });
      it('Should add a success Toast if the call returns successful', () => {
        const mockToast = jest.fn();
        mockUsePassReset.mockImplementation(() => ({ status: 'success' }) as any);
        mockAddToast.mockImplementation(() => mockToast);

        render(<SecuritySettingsPage />);

        expect(mockToast).toHaveBeenCalledWith({ message: 'Email sent', type: 'success' });
      });
      it('Should add an error Toast if the call returns an error', () => {
        const mockToast = jest.fn();
        mockUsePassReset.mockImplementation(() => ({ status: 'error' }) as any);
        mockAddToast.mockImplementation(() => mockToast);

        render(<SecuritySettingsPage />);

        expect(mockToast).toHaveBeenCalledWith({
          message: expect.any(String),
          type: 'error',
        });
      });
    });
  });

  describe('Global logout', () => {
    describe('Render', () => {
      it('Should have a header indicating the form', () => {
        render(<SecuritySettingsPage />);
        const logoutForm = screen.getByTestId('logout-form');

        const title = within(logoutForm).getByRole('heading');

        expect(title).toHaveTextContent('Logout from all devices');
      });
      it('Should have a logout button', () => {
        render(<SecuritySettingsPage />);
        const logoutForm = screen.getByTestId('logout-form');

        const logBttn = within(logoutForm).getAllByRole('button')[0];

        expect(logBttn).toHaveAttribute('type', 'button');
        expect(logBttn).toHaveTextContent('Logout');
      });
    });
    describe('Behaviour', () => {
      it('should add the show-logout param when the logout button is clicked', async () => {
        const mockReplace = jest.fn();
        mockRouter.mockImplementation(() => ({ route: '/', replace: mockReplace }) as any);
        render(<SecuritySettingsPage />);
        const logoutForm = screen.getByTestId('logout-form');

        const logBttn = within(logoutForm).getAllByRole('button')[0];
        await userEvent.click(logBttn);

        expect(mockReplace).toHaveBeenCalledWith('/?show-logout=y');
      });
      it('should call the global logout mutation when the logout modal is confirmed', async () => {
        const mutate = jest.fn();
        mockGlobalLogout.mockImplementation(() => ({ mutate }) as any);
        render(<SecuritySettingsPage />);
        const logoutForm = screen.getByTestId('logout-form');

        const confirmBttn = within(logoutForm).getAllByRole('button')[1];
        await userEvent.click(confirmBttn);

        expect(mutate).toHaveBeenCalled();
      });
    });
  });
});
