// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// Tested Components ----------------------------------------------------------
import SecuritySettingsPage from '@/app/(auth-routes)/settings/security/page';

// Stubs ----------------------------------------------------------------------
const stubForm = (name: string) => <div data-testid="form-item">{name}</div>;

// Mocks ----------------------------------------------------------------------
jest.mock('../../../../libs/feature-settings/ChangePasswordForm', () => ({
  ChangePasswordForm: () => stubForm('Change Pass'),
}));
jest.mock('../../../../libs/feature-settings/ResetPasswordForm', () => ({
  ResetPasswordForm: () => stubForm('Reset Pass'),
}));
jest.mock('../../../../libs/feature-settings/LogoutAllForm', () => ({
  LogoutAllForm: () => stubForm('Logout All'),
}));

// Tests ----------------------------------------------------------------------
describe('Security Settings Page', () => {
  describe('Render', () => {
    it('should render all the forms in the correct order', () => {
      render(<SecuritySettingsPage />);
      const forms = screen.getAllByTestId('form-item');

      expect(forms[0]).toHaveTextContent('Change Pass');
      expect(forms[1]).toHaveTextContent('Reset Pass');
      expect(forms[2]).toHaveTextContent('Logout All');
    });
  });
});
