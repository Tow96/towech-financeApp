// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// Tested Components ----------------------------------------------------------
import { AuthProvider } from '../AuthProvider';
import * as UserService from '../UserService';
import * as Navigation from 'next/navigation';

// Stubs ----------------------------------------------------------------------
const stubContent = <div data-testid="test-content">Content</div>;

// Mocks ----------------------------------------------------------------------
jest.mock('../UserService', () => ({
  useAuth: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
const mockUseAuth = jest.spyOn(UserService, 'useAuth');
const mockRedirect = jest.spyOn(Navigation, 'redirect');

// Tests ----------------------------------------------------------------------
describe('AuthProvider', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('Render', () => {
    describe('user.isPending is false', () => {
      beforeEach(() => mockUseAuth.mockImplementation(() => ({ isPending: false }) as any));

      it('should render the content', () => {
        render(<AuthProvider>{stubContent}</AuthProvider>);
        const content = screen.getByTestId('test-content');

        expect(content).toBeInTheDocument();
      });
      it('should not render the loading spinner', () => {
        render(<AuthProvider>{stubContent}</AuthProvider>);

        expect(() => screen.getByTestId('auth-loading')).toThrow();
      });
    });
    describe('user.isPending is true', () => {
      beforeEach(() => mockUseAuth.mockImplementation(() => ({ isPending: true }) as any));

      it('should not render the content', () => {
        render(<AuthProvider>{stubContent}</AuthProvider>);
        expect(() => screen.getByTestId('test-content')).toThrow();
      });
      it('should render the loading spinner', () => {
        render(<AuthProvider>{stubContent}</AuthProvider>);
        const content = screen.getByTestId('auth-loading');
        expect(content).toBeInTheDocument();
      });
    });
  });
  describe('Behaviour', () => {
    describe('Authenticated route', () => {
      it('should not redirect if refreshing the token is successful', () => {
        mockUseAuth.mockImplementation(() => ({ isPending: false, isError: false }) as any);
        render(<AuthProvider>{stubContent}</AuthProvider>);

        expect(mockRedirect).toHaveBeenCalledTimes(0);
      });
      it('should redirect to the login page if refreshing the token is unsuccessful', () => {
        mockUseAuth.mockImplementation(() => ({ isPending: false, isError: true }) as any);
        render(<AuthProvider>{stubContent}</AuthProvider>);

        expect(mockRedirect).toHaveBeenCalledTimes(1);
        expect(mockRedirect).toHaveBeenCalledWith('/login');
      });
    });
    describe('Unauthenticated route', () => {
      it('should not redirect if refreshing the token is unsuccessful', () => {
        mockUseAuth.mockImplementation(() => ({ isPending: false, isSuccess: false }) as any);
        render(<AuthProvider auth={false}>{stubContent}</AuthProvider>);

        expect(mockRedirect).toHaveBeenCalledTimes(0);
      });
      it('should redirect to the dashboard page if refreshing the token is successful', () => {
        mockUseAuth.mockImplementation(() => ({ isPending: false, isSuccess: true }) as any);
        render(<AuthProvider auth={false}>{stubContent}</AuthProvider>);

        expect(mockRedirect).toHaveBeenCalledTimes(1);
        expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
      });
    });
  });
});
