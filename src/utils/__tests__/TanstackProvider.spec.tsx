// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// Tested Components ----------------------------------------------------------
import TanstackProvider from '../TanstackProvider';

// Stubs ----------------------------------------------------------------------
const stubContent = <div data-testid="test-content">Content</div>;

// Mocks ----------------------------------------------------------------------

// Tests ----------------------------------------------------------------------
describe('TanstackProvider', () => {
  describe('Render', () => {
    it('should render the given content', () => {
      render(<TanstackProvider>{stubContent}</TanstackProvider>);

      const content = screen.getByTestId('test-content');

      expect(content).toBeInTheDocument();
    });
  });
});
