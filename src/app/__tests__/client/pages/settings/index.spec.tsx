// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import * as Navigation from 'next/navigation';
// Tested Components ----------------------------------------------------------
import SettingsPage from '@/app/(auth-routes)/settings/page';

// Stubs ----------------------------------------------------------------------

// Mocks ----------------------------------------------------------------------
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
const mockRedirect = jest.spyOn(Navigation, 'redirect');

// Tests ----------------------------------------------------------------------
describe('Settings Page', () => {
  describe('Behaviour', () => {
    it('should immediately redirect to the user settings', () => {
      render(<SettingsPage />);

      expect(mockRedirect).toHaveBeenCalledWith('/settings/user');
    });
  });
});
