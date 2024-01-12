// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as UserService from '@/libs/feature-authentication/UserService';
import * as ToastService from '@/libs/feature-toasts/ToastService';
// Tested Components ----------------------------------------------------------
import UserSettingsPage from '@/app/(auth-routes)/settings/user/page';

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
jest.mock('../../../../libs/feature-authentication/UserService', () => ({
  useAuth: jest.fn(),
  useEditUser: jest.fn(),
}));
jest.mock('../../../../libs/feature-toasts/ToastService', () => ({
  useAddToast: jest.fn(),
}));
const mockUseAuth = jest.spyOn(UserService, 'useAuth');
const mockUseEditUser = jest.spyOn(UserService, 'useEditUser');
const mockAddToast = jest.spyOn(ToastService, 'useAddToast');

// Tests ----------------------------------------------------------------------
describe('User Settings Page', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockUseAuth.mockImplementation(() => ({ data: stubUser, status: 'success' }) as any);
    mockUseEditUser.mockImplementation(() => ({ mutate: () => ({}) }) as any);
    mockAddToast.mockImplementation(() => () => {});
  });

  describe('Edit User Form', () => {
    describe('Render', () => {
      it('Should have a header indicating the form', () => {
        render(<UserSettingsPage />);
        const userForm = screen.getByTestId('user-form');

        const title = within(userForm).getByRole('heading');

        expect(title).toHaveTextContent('Change User');
      });
      it("Should have a name input with the user's name in it", () => {
        render(<UserSettingsPage />);
        const userForm = screen.getByTestId('user-form');

        const nameInput = within(userForm).getByLabelText('Name');

        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveValue(stubUser.name);
      });
      it("Should have an email input with the user's email in it", () => {
        render(<UserSettingsPage />);
        const userForm = screen.getByTestId('user-form');

        const emailInput = within(userForm).getByLabelText('Email');

        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveValue(stubUser.username);
      });
      it('Should render a Save button', () => {
        render(<UserSettingsPage />);
        const userForm = screen.getByTestId('user-form');

        const saveBttn = within(userForm).getByRole('button');

        expect(saveBttn).toHaveAttribute('type', 'submit');
        expect(saveBttn).toHaveTextContent('Save');
      });
      it('Should render a spinner if the status is pending', () => {
        mockUseEditUser.mockImplementation(() => ({ status: 'pending' }) as any);

        render(<UserSettingsPage />);
        const userForm = screen.getByTestId('user-form');

        const spinner = within(userForm).getByRole('status');

        expect(spinner).toBeInTheDocument();
      });
      it('Should not render a spinner if status is not pending', () => {
        mockUseEditUser.mockImplementation(() => ({ status: 'idle' }) as any);
        render(<UserSettingsPage />);
        const userForm = screen.getByTestId('user-form');
        expect(() => within(userForm).getByRole('status')).toThrow();
      });
    });
    describe('Behaviour', () => {
      it('The save button should be disabled when there are no changes in the user', async () => {
        render(<UserSettingsPage />);
        const userForm = screen.getByTestId('user-form');

        const saveBttn = within(userForm).getByRole('button');
        expect(saveBttn).toBeDisabled();

        const nameInput = within(userForm).getByLabelText('Name');
        await userEvent.type(nameInput, 'anotherName');

        expect(saveBttn).toBeEnabled();
      });
      it('Should send the parameters when save is clicked', async () => {
        const mutate = jest.fn();
        mockUseEditUser.mockImplementation(() => ({ mutate }) as any);

        render(<UserSettingsPage />);
        const userForm = screen.getByTestId('user-form');

        const nameInput = within(userForm).getByLabelText('Name');
        const emailInput = within(userForm).getByLabelText('Email');
        const saveBttn = within(userForm).getByRole('button');

        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'newName');
        await userEvent.clear(emailInput);
        await userEvent.type(emailInput, 'newEmail@provider.com');
        await userEvent.click(saveBttn);

        expect(mutate).toHaveBeenCalledWith({ name: 'newName', username: 'newEmail@provider.com' });
      });
      it('Should add a success Toast if the call returns successful', () => {
        const mockToast = jest.fn();
        mockUseEditUser.mockImplementation(() => ({ status: 'success' }) as any);
        mockAddToast.mockImplementation(() => mockToast);

        render(<UserSettingsPage />);

        expect(mockToast).toHaveBeenCalledWith({
          message: 'User updated',
          type: 'success',
        });
      });
      it('Should add an error Toast if the call returns an error', () => {
        const mockToast = jest.fn();
        mockUseEditUser.mockImplementation(() => ({ status: 'error' }) as any);
        mockAddToast.mockImplementation(() => mockToast);

        render(<UserSettingsPage />);

        expect(mockToast).toHaveBeenCalledWith({
          message: expect.any(String),
          type: 'error',
        });
      });
    });
  });
});
