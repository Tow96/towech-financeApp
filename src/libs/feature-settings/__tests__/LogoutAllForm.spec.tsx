// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// Tested Components ----------------------------------------------------------
import { LogoutAllForm } from '../LogoutAllForm';

// Mocks ----------------------------------------------------------------------
const mockLogoutAll = jest.fn(() => ({ mutate: () => ({}), status: 'idle' }));
const mockRouteReplace = jest.fn();
const mockRouteRedirect = jest.fn();
jest.mock('next/navigation', () => ({
  redirect: (s: string) => mockRouteRedirect(s),
  usePathname: () => '/',
  useRouter: () => ({ route: '/', replace: mockRouteReplace }),
  useSearchParams: () => ({}),
}));
jest.mock('../../feature-authentication/UserService', () => ({
  useLogoutAll: () => mockLogoutAll(),
}));

// Tests ----------------------------------------------------------------------
describe('Global logout', () => {
  describe('Render', () => {
    it('Should have a header indicating the form', () => {
      render(<LogoutAllForm />);
      const title = screen.getByRole('heading');

      expect(title).toHaveTextContent('Logout from all devices');
    });
    it('Should have a logout button', () => {
      render(<LogoutAllForm />);
      const logBttn = screen.getAllByRole('button')[0];

      expect(logBttn).toHaveAttribute('type', 'button');
      expect(logBttn).toHaveTextContent('Logout');
    });
  });
  describe('Behaviour', () => {
    it('should add the show-logout param when the logout button is clicked', async () => {
      render(<LogoutAllForm />);
      const logBttn = screen.getAllByRole('button')[0];
      await userEvent.click(logBttn);

      expect(mockRouteReplace).toHaveBeenCalledWith('/?show-logout=y');
    });
    it('should call the global logout mutation when the logout modal is confirmed', async () => {
      const mutate = jest.fn();
      mockLogoutAll.mockImplementation(() => ({ mutate }) as any);
      render(<LogoutAllForm />);
      const confirmBttn = screen.getAllByRole('button')[1];
      await userEvent.click(confirmBttn);
      expect(mutate).toHaveBeenCalled();
    });
    it('Should redirect to the login page if the call returns successful', () => {
      mockLogoutAll.mockImplementation(() => ({ status: 'success' }) as any);
      render(<LogoutAllForm />);

      expect(mockRouteRedirect).toHaveBeenCalledWith('/login');
    });
    it('Should redirect to the login page if the call returns an error', () => {
      mockLogoutAll.mockImplementation(() => ({ status: 'error' }) as any);
      render(<LogoutAllForm />);

      expect(mockRouteRedirect).toHaveBeenCalledWith('/login');
    });
  });
});
