// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// Tested Components ----------------------------------------------------------
import DashboardPage from '@/app/(auth-routes)/dashboard/page';

// Stubs ----------------------------------------------------------------------

// Mocks ----------------------------------------------------------------------

// Tests ----------------------------------------------------------------------
describe('Settings Page', () => {
  describe('Render', () => {
    it('Should have the Settings header', () => {
      render(<DashboardPage />);
      const title = screen.getByRole('heading');
      expect(title).toHaveTextContent('Dashboard');
    });
  });
});
