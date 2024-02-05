// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// Tested Components ----------------------------------------------------------
import { Navbar } from '@/libs/feature-navbar/Navbar';

// // Stubs ----------------------------------------------------------------------
// const stubTitle = 'TestNav';

// Mocks ----------------------------------------------------------------------
const mockUseLogout = jest.fn(() => ({ mutate: () => ({}), status: 'idle' }));
const mockRouteRedirect = jest.fn();
jest.mock('../../../feature-authentication/UserService.ts', () => ({
  useLogout: () => mockUseLogout(),
}));
jest.mock('next/navigation', () => ({
  redirect: (s: string) => mockRouteRedirect(s),
  usePathname: () => '/',
}));

// Tests ----------------------------------------------------------------------
describe('Navbar', () => {
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
    // it('should render a heading containing the given title of the screen', () => {
    //   render(<Navbar />);
    //   const heading = screen.getByRole('heading');

    //   expect(heading).toHaveTextContent(stubTitle);
    // });
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
      const mutate = jest.fn();
      mockUseLogout.mockImplementation(() => ({ mutate, status: 'idle' }));
      render(<Navbar />);

      const mi = screen.getAllByRole('menuitem');
      await userEvent.click(mi[mi.length - 1]);

      expect(mutate).toHaveBeenCalledTimes(1);
    });
    it('should redirect to the login page if a logout call is successful', () => {
      mockUseLogout.mockImplementation(() => ({ mutate: () => ({}), status: 'success' }) as any);
      render(<Navbar />);

      expect(mockRouteRedirect).toHaveBeenCalledWith('/login');
    });
  });
});
