// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import * as Navigation from 'next/navigation';
// Tested Components ----------------------------------------------------------
import AppPage from '@/app/page';

// Stubs ----------------------------------------------------------------------

// Mocks ----------------------------------------------------------------------
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
const mockRedirect = jest.spyOn(Navigation, 'redirect');

// Tests ----------------------------------------------------------------------
describe('Root page', () => {
  describe('Behaviour', () => {
    it('should immediately redirect to the dashboard', () => {
      render(<AppPage />);

      expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
    });
  });
});
