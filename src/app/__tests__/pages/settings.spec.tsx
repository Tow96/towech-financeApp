// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// Tested Components ----------------------------------------------------------
import SettingsPage from '@/app/(auth-routes)/settings/page';

// Stubs ----------------------------------------------------------------------

// Mocks ----------------------------------------------------------------------

// Tests ----------------------------------------------------------------------
describe('Settings Page', () => {
  describe('Render', () => {
    it('Should have the Settings header', () => {
      render(<SettingsPage />);
      const title = screen.getByRole('heading');
      expect(title).toHaveTextContent('Settings');
    });
  });
});
