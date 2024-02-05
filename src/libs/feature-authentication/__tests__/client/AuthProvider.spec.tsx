// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import * as Navigation from 'next/navigation';
// Tested Components ----------------------------------------------------------
import { AuthProvider } from '@/libs/feature-authentication/AuthProvider';
import * as UserService from '@/libs/feature-authentication/UserService';

// Stubs ----------------------------------------------------------------------
const stubContent = <div data-testid="test-content">Content</div>;

// Mocks ----------------------------------------------------------------------
jest.mock('../../UserService', () => ({
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
      beforeEach(() =>
        mockUseAuth.mockImplementation(() => ({ status: 'idle', isPending: false }) as any)
      );

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
      beforeEach(() =>
        mockUseAuth.mockImplementation(() => ({ status: 'pending', isPending: true }) as any)
      );

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
        mockUseAuth.mockImplementation(() => ({ status: 'successful' }) as any);
        render(<AuthProvider>{stubContent}</AuthProvider>);

        expect(mockRedirect).toHaveBeenCalledTimes(0);
      });
      it('should redirect to the login page if refreshing the token is unsuccessful', () => {
        mockUseAuth.mockImplementation(() => ({ status: 'error' }) as any);
        render(<AuthProvider>{stubContent}</AuthProvider>);

        expect(mockRedirect).toHaveBeenCalledTimes(1);
        expect(mockRedirect).toHaveBeenCalledWith('/login');
      });
    });
    describe('Unauthenticated route', () => {
      it('should not redirect if refreshing the token is unsuccessful', () => {
        mockUseAuth.mockImplementation(() => ({ status: 'error' }) as any);
        render(<AuthProvider auth={false}>{stubContent}</AuthProvider>);

        expect(mockRedirect).toHaveBeenCalledTimes(0);
      });
      it('should redirect to the dashboard page if refreshing the token is successful', () => {
        mockUseAuth.mockImplementation(() => ({ status: 'success' }) as any);
        render(<AuthProvider auth={false}>{stubContent}</AuthProvider>);

        expect(mockRedirect).toHaveBeenCalledTimes(1);
        expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
      });
    });
  });
});
