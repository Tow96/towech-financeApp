// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// Tested Components ----------------------------------------------------------
import NoAuthLayout from '@/app/(no-auth-routes)/layout';

// Stubs ----------------------------------------------------------------------

// Mocks ----------------------------------------------------------------------
const mockProvider = jest.fn();
jest.mock('../../../libs/feature-authentication/AuthProvider', () => ({
  /* eslint-disable react/display-name */
  AuthProvider: (props: { auth?: boolean }) => {
    mockProvider(props);
    return <div data-testid="provider" />;
  },
  /* eslint-enable */
}));

// Tests ----------------------------------------------------------------------
describe('No Auth Routes Layout', () => {
  it('should have an auth provider with the auth prop set as none', () => {
    render(<NoAuthLayout />);

    const provider = screen.getByTestId('provider');

    expect(provider).toBeInTheDocument();
    expect(mockProvider).toHaveBeenLastCalledWith({ auth: false });
  });
});
