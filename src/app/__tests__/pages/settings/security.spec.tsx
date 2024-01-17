// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as UserService from '@/libs/feature-authentication/UserService';
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
const stubForm = (name: string) => <div data-testid="form-item">{name}</div>;

// Mocks ----------------------------------------------------------------------
jest.mock('../../../../libs/feature-settings/ChangePasswordForm', () => ({
  ChangePasswordForm: () => stubForm('Change Pass'),
}));
jest.mock('../../../../libs/feature-settings/ResetPasswordForm.tsx', () => ({
  ResetPasswordForm: () => stubForm('Reset Pass'),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
  redirect: jest.fn(),
}));
jest.mock('../../../../libs/feature-authentication/UserService', () => ({
  useAuth: jest.fn(),
  useGlobalLogout: jest.fn(),
}));
const mockUseAuth = jest.spyOn(UserService, 'useAuth');
const mockRouter = jest.spyOn(Navigation, 'useRouter');
const mockPath = jest.spyOn(Navigation, 'usePathname');
const mockParams = jest.spyOn(Navigation, 'useSearchParams');
const mockGlobalLogout = jest.spyOn(UserService, 'useGlobalLogout');

// Tests ----------------------------------------------------------------------
describe('Security Settings Page', () => {
  describe('Render', () => {
    it('should render all the forms in the correct order', () => {
      render(<SecuritySettingsPage />);
      const forms = screen.getAllByTestId('form-item');

      expect(forms[0]).toHaveTextContent('Change Pass');
      expect(forms[1]).toHaveTextContent('Reset Pass');
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();
    mockUseAuth.mockImplementation(() => ({ data: stubUser, status: 'success' }) as any);
    mockGlobalLogout.mockImplementation(() => ({ mutate: () => ({}) }) as any);
    mockRouter.mockImplementation(() => ({ route: '/' }) as any);
    mockPath.mockImplementation(() => '/');
    mockParams.mockImplementation(() => ({}) as any);
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
