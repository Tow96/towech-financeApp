// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// Tested Components ----------------------------------------------------------
import { SettingsMenuItem } from '../../MenuItem';

// Mocks ----------------------------------------------------------------------
const mockUsePathname = jest.fn(() => '/settings');
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

// Tests ----------------------------------------------------------------------
describe('Settings Menu Item Component', () => {
  describe('Render', () => {
    it('should have an icon', () => {
      render(<SettingsMenuItem href="pesto" icon="hamburger" name="pesto" />);
      const icon = screen.getByTestId('icon');
      expect(icon).toBeInTheDocument();
    });
    it('should have a text indicating the name of the item', () => {
      const name = 'pesto';
      render(<SettingsMenuItem href="pesto" icon="hamburger" name={name} />);
      const link = screen.getByRole('link');
      expect(link).toHaveTextContent(name);
    });
    it('should redirect to the correct settings subpage when clicked', () => {
      const destination = 'pesto';
      render(<SettingsMenuItem href={destination} icon="hamburger" name="pesto" />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', destination);
    });
  });
  describe('Behaviour', () => {
    it("should be enabled when the href and the last part of the current path don't match", () => {
      render(<SettingsMenuItem href="pesto" icon="hamburger" name="pesto" />);
      const link = screen.getByRole('link');

      expect(link).toHaveAttribute('aria-disabled', 'false');
      expect(link).not.toHaveClass('pointer-events-none');
    });
    it('should be disabled when the href and the last part of the current path do match', () => {
      mockUsePathname.mockImplementation(() => '/settings/pesto');
      render(<SettingsMenuItem href="pesto" icon="hamburger" name="pesto" />);
      const link = screen.getByRole('link');

      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveClass('pointer-events-none');
    });
  });
});
