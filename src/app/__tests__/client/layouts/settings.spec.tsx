// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
// Tested Components ----------------------------------------------------------
import SettingsLayout, { metadata } from '@/app/(auth-routes)/settings/layout';

// Stubs ----------------------------------------------------------------------
const stubContent = <div data-testid="test-content">CONTENT</div>;
const stubMenuItem = (name: string) => <div data-testid="menu-item">{name}</div>;

// Mocks ----------------------------------------------------------------------
jest.mock('../../../../libs/feature-settings/MenuItem', () => ({
  SettingsMenuItem: ({ name }: { name: string }) => stubMenuItem(name),
}));

// Tests ----------------------------------------------------------------------
describe('Settings Layout', () => {
  describe('Render', () => {
    it('should set the page title to "Settings"', () => {
      expect(metadata.title).toBe('Settings');
    });
    it('should render a nav containing three items', () => {
      render(<SettingsLayout>{stubContent}</SettingsLayout>);
      const nav = screen.getByRole('navigation');
      const items = within(nav).getAllByTestId('menu-item');

      expect(items.length).toBe(2);
    });
    it('should render the child content', () => {
      render(<SettingsLayout>{stubContent}</SettingsLayout>);

      const content = screen.getByTestId('test-content');
      expect(content).toBeInTheDocument();
    });
  });
  // describe('Behaviour', () => {
  //   it('should update the title of the navbar', () => {
  //     const mockUpdate = jest.fn();
  //     mockTitle.mockImplementation(() => mockUpdate);

  //     render(<SettingsLayout>{stubContent}</SettingsLayout>);

  //     expect(mockUpdate).toHaveBeenCalledWith('Settings');
  //   });
  // });
});
