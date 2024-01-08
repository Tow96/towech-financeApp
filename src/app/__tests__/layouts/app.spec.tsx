// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// Tested Components ----------------------------------------------------------
import AppLayout, { metadata } from '@/app/layout';

// Stubs ----------------------------------------------------------------------

// Mocks ----------------------------------------------------------------------
/* eslint-disable react/display-name */
jest.mock('../../../utils/TanstackProvider', () => (props: { children: React.ReactNode }) => (
  <div data-testid="tanstack">{props.children}</div>
));
jest.mock('../../../libs/feature-toasts/ToastProvider', () => ({
  ToastProvider: (props: { children: React.ReactNode }) => (
    <div data-testid="toasts">{props.children}</div>
  ),
}));
/* eslint-enable */

// Tests ----------------------------------------------------------------------
describe('App Layout', () => {
  it('should set the toast provider for the whole app', () => {
    render(<AppLayout> </AppLayout>);

    const toasts = screen.getByTestId('toasts');

    expect(toasts).toBeInTheDocument();
  });
  it('should the tanstack provider for the whole app', () => {
    render(<AppLayout> </AppLayout>);

    const tanstack = screen.getByTestId('tanstack');

    expect(tanstack).toBeInTheDocument();
  });
  it('should have the correct metadata', () => {
    expect(metadata).toEqual({
      title: 'Towech Finance App',
      description: expect.any(String),
    });
  });
});
