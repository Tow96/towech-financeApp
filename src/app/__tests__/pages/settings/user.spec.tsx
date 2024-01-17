// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// Tested Components ----------------------------------------------------------
import UserSettingsPage from '@/app/(auth-routes)/settings/user/page';

// Stubs ----------------------------------------------------------------------
const stubForm = (name: string) => <div data-testid="form-item">{name}</div>;

// Mocks ----------------------------------------------------------------------
jest.mock('../../../../libs/feature-settings/editUserForm', () => ({
  EditUserForm: () => stubForm('User Form'),
}));
jest.mock('../../../../libs/feature-settings/resendVerificationForm', () => ({
  ResendVerificationForm: () => stubForm('Resend Mail'),
}));

// Tests ----------------------------------------------------------------------
describe('User Settings Page', () => {
  describe('Render', () => {
    it('should render all the forms in the correct order', () => {
      render(<UserSettingsPage />);
      const forms = screen.getAllByTestId('form-item');

      expect(forms[0]).toHaveTextContent('User Form');
      expect(forms[1]).toHaveTextContent('Resend Mail');
    });
  });
});
