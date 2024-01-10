// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as UserService from '@/libs/feature-authentication/UserService';
import * as NavService from '@/libs/feature-navbar/NavbarService';
import * as Navigation from 'next/navigation';
// Tested Components ----------------------------------------------------------
import { Navbar } from '../Navbar';

// Stubs ----------------------------------------------------------------------
const stubTitle = 'TestNav';

// Mocks ----------------------------------------------------------------------
jest.mock('../../../libs/feature-authentication/UserService.ts', () => ({
  useLogout: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  usePathname: jest.fn(),
}));
jest.mock('../NavbarService', () => ({
  useNavStore: jest.fn(),
}));
const mockUseLogout = jest.spyOn(UserService, 'useLogout');
const mockRedirect = jest.spyOn(Navigation, 'redirect');
const mockUsePathname = jest.spyOn(Navigation, 'usePathname');
const mockUseNav = jest.spyOn(NavService, 'useNavStore');

// Tests ----------------------------------------------------------------------
describe('Navbar', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockUseLogout.mockImplementation(() => ({ mutate: () => ({}) }) as any);
    mockUsePathname.mockImplementation(() => '/');
    mockUseNav.mockImplementation(() => ({ title: stubTitle }));
  });

  describe('Render', () => {
    it('should render a nav tag', () => {
      render(<Navbar />);

      const nav = screen.getByRole('navigation');

      expect(nav).toBeInTheDocument();
    });
    it('should not render a dismiss area if the menu is collapsed', () => {
      render(<Navbar />);

      expect(() => screen.getByTestId('dismiss-area')).toThrow();
    });
    it('should render a dismiss area if the menu is not collapsed', async () => {
      render(<Navbar />);

      const mi = screen.getAllByRole('menuitem');
      await userEvent.click(mi[0]);

      const area = screen.getByTestId('dismiss-area');

      expect(area).toBeInTheDocument();
    });
    it('should render a heading containing the given title of the screen', () => {
      render(<Navbar />);
      const heading = screen.getByRole('heading');

      expect(heading).toHaveTextContent(stubTitle);
    });
  });

  describe('Behaviour', () => {
    it('should toggle the collapse status when the first button is clicked', async () => {
      render(<Navbar />);

      const mi = screen.getAllByRole('menuitem');
      expect(mi.every(val => val.getAttribute('aria-expanded') === 'false')).toBeTruthy();

      await userEvent.click(mi[0]);
      expect(mi.every(val => val.getAttribute('aria-expanded') === 'false')).toBeFalsy();

      await userEvent.click(mi[0]);
      expect(mi.every(val => val.getAttribute('aria-expanded') === 'false')).toBeTruthy();
    });

    it('should collapse the menu when the dimiss area is clicked', async () => {
      render(<Navbar />);

      const mi = screen.getAllByRole('menuitem');
      await userEvent.click(mi[0]);
      const area = screen.getByTestId('dismiss-area');
      await userEvent.click(area);

      expect(mi.every(val => val.getAttribute('aria-expanded') === 'false')).toBeTruthy();
    });

    it('should call useLogout when the last button is clicked', async () => {
      render(<Navbar />);

      const mi = screen.getAllByRole('menuitem');
      await userEvent.click(mi[mi.length - 1]);

      expect(mockUseLogout).toHaveBeenCalledTimes(1);
    });

    it('should redirect to the login page if a logout call is successful', () => {
      mockUseLogout.mockImplementation(() => ({ mutate: () => ({}), status: 'success' }) as any);
      render(<Navbar />);

      expect(mockRedirect).toHaveBeenCalledWith('/login');
    });
  });
});
