// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// Tested Components ----------------------------------------------------------
import AuthLayout from '@/app/(auth-routes)/layout';

// Stubs ----------------------------------------------------------------------

// Mocks ----------------------------------------------------------------------
const mockProvider = jest.fn();
jest.mock('../../../libs/feature-authentication/AuthProvider', () => ({
  /* eslint-disable react/display-name */
  AuthProvider: (props: { auth?: boolean; children?: React.ReactNode }) => {
    mockProvider(props);
    return <div data-testid="provider">{props.children}</div>;
  },
  /* eslint-enable */
}));
jest.mock('../../../libs/feature-navbar/Navbar', () => ({
  Navbar: () => <div data-testid="navbar" />,
}));

// Tests ----------------------------------------------------------------------
describe('Auth Routes Layout', () => {
  it('should have an auth provider with the auth prop set as true', () => {
    render(<AuthLayout />);

    const provider = screen.getByTestId('provider');

    expect(provider).toBeInTheDocument();
    expect(mockProvider).toHaveBeenCalledTimes(1);
  });
  it('should have the navbar', () => {
    render(<AuthLayout />);

    const navbar = screen.getByTestId('navbar');

    expect(navbar).toBeInTheDocument();
  });
});
