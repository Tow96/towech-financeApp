// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { User } from '@/libs/feature-authentication/UserService';
// Tested Components ----------------------------------------------------------
import { EditUserForm } from '@/libs/feature-settings/EditUserForm';

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
const mockUseEditUser = jest.fn(() => ({ mutate: () => ({}), status: 'idle' }));
const mockToast = jest.fn();

jest.mock('../../../feature-authentication/UserService', () => ({
  useAuth: () => ({ data: stubUser, status: 'success' }),
  useEditUser: () => mockUseEditUser(),
}));
jest.mock('../../../feature-toasts/ToastService', () => ({
  useAddToast: () => mockToast,
}));

// Tests ----------------------------------------------------------------------
describe('Edit User Form', () => {
  describe('Render', () => {
    it('Should have a header indicating the form', () => {
      render(<EditUserForm />);
      const title = screen.getByRole('heading');

      expect(title).toHaveTextContent('Change User');
    });
    it("Should have a name input with the user's name in it", () => {
      render(<EditUserForm />);
      const nameInput = screen.getByLabelText('Name');

      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveValue(stubUser.name);
    });
    it("Should have an email input with the user's email in it", () => {
      render(<EditUserForm />);
      const emailInput = screen.getByLabelText('Email');

      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveValue(stubUser.username);
    });
    it('Should render a Save button', () => {
      render(<EditUserForm />);
      const saveBttn = screen.getByRole('button');

      expect(saveBttn).toHaveAttribute('type', 'submit');
      expect(saveBttn).toHaveTextContent('Save');
    });
  });
  describe('Behaviour', () => {
    it('The save button should be disabled when there are no changes in the user', async () => {
      render(<EditUserForm />);
      const saveBttn = screen.getByRole('button');
      expect(saveBttn).toBeDisabled();

      const nameInput = screen.getByLabelText('Name');
      await userEvent.type(nameInput, 'anotherName');

      expect(saveBttn).toBeEnabled();
    });
    it('Should send the parameters when save is clicked', async () => {
      const mutate = jest.fn();
      mockUseEditUser.mockImplementation(() => ({ mutate }) as any);

      render(<EditUserForm />);
      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const saveBttn = screen.getByRole('button');

      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'newName');
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, 'newEmail@provider.com');
      await userEvent.click(saveBttn);

      expect(mutate).toHaveBeenCalledWith({ name: 'newName', username: 'newEmail@provider.com' });
    });
    it('Should disable the inputs and button if the status is pending', () => {
      mockUseEditUser.mockImplementationOnce(() => ({ status: 'pending', isPending: true }) as any);

      render(<EditUserForm />);
      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const saveBttn = screen.getByRole('button');

      expect(nameInput).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(saveBttn).toBeDisabled();
    });
    it('Should set the button to "loading" if the status is pending', () => {
      mockUseEditUser.mockImplementationOnce(() => ({ status: 'pending', isPending: true }) as any);
      render(<EditUserForm />);
      const saveBttn = screen.getByRole('button');

      expect(saveBttn).toHaveAttribute('aria-busy', 'true');
    });
    it('Should add a success Toast if the call returns successful', () => {
      mockUseEditUser.mockImplementation(() => ({ status: 'success' }) as any);
      render(<EditUserForm />);

      expect(mockToast).toHaveBeenCalledWith({
        message: 'User updated',
        type: 'success',
      });
    });
    it('Should add an error Toast if the call returns an error', () => {
      mockUseEditUser.mockImplementation(() => ({ status: 'error' }) as any);
      render(<EditUserForm />);

      expect(mockToast).toHaveBeenCalledWith({
        message: expect.any(String),
        type: 'error',
      });
    });
  });
});
