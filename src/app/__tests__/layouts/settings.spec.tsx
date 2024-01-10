// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import * as NavService from '@/libs/feature-navbar/NavbarService';
// Tested Components ----------------------------------------------------------
import SettingsLayout from '@/app/(auth-routes)/settings/layout';

// Stubs ----------------------------------------------------------------------
const stubContent = <div data-testid="test-content">CONTENT</div>;

// Mocks ----------------------------------------------------------------------
jest.mock('../../../libs/feature-navbar/NavbarService', () => ({
  useUpdateTitle: jest.fn(),
}));
const mockTitle = jest.spyOn(NavService, 'useUpdateTitle');

// Tests ----------------------------------------------------------------------
describe('Settings Layout', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    mockTitle.mockImplementation(() => () => {});
  });

  describe('Render', () => {
    it('should render the child content', () => {
      render(<SettingsLayout>{stubContent}</SettingsLayout>);

      const content = screen.getByTestId('test-content');
      expect(content).toBeInTheDocument();
    });
  });
  describe('Behaviour', () => {
    it('should update the title of the navbar', () => {
      const mockUpdate = jest.fn();
      mockTitle.mockImplementation(() => mockUpdate);

      render(<SettingsLayout>{stubContent}</SettingsLayout>);

      expect(mockUpdate).toHaveBeenCalledWith('Settings');
    });
  });
});
