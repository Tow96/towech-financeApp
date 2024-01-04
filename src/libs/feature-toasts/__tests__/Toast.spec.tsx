// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { Toast } from '../ToastService';
// Tested Components ----------------------------------------------------------
import { ToastComponent } from '../Toast';

// Stubs ----------------------------------------------------------------------
const stubToast: Toast = { id: 'test', message: 'This is a test toast', type: 'info' };

// Mocks ----------------------------------------------------------------------
const mockDismiss = jest.fn();
jest.mock('../ToastService', () => ({
  useDismissToast: () => mockDismiss,
}));

// Tests ----------------------------------------------------------------------
describe('Toast Component', () => {
  describe('Render', () => {
    it('Should have the message displayed', () => {
      render(<ToastComponent toast={stubToast} />);
      const msg = screen.getByRole('alertdialog');
      expect(msg).toHaveTextContent(stubToast.message);
    });
    it.todo('Should have the correct color depending on the type');
  });

  describe('Behaviour', () => {
    it('should dismiss itself after 4 seconds', () => {
      jest.useFakeTimers();
      render(<ToastComponent toast={stubToast} />);
      expect(mockDismiss).toHaveBeenCalledTimes(0);

      act(() => {
        jest.runOnlyPendingTimers();
      });
      expect(mockDismiss).toHaveBeenCalledTimes(1);
    });
  });
});
