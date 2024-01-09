// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { Toast } from '../ToastService';
// Tested Components ----------------------------------------------------------
import { ToastComponent } from '../Toast';

// Stubs ----------------------------------------------------------------------
const stubInfoToast: Toast = { id: 'test', message: 'This is a test toast', type: 'info' };
const stubErrorToast: Toast = { id: 'test', message: 'This is a test error', type: 'error' };
const stubSuccessToast: Toast = { id: 'test', message: 'This is a test success', type: 'success' };
const stubWarningToast: Toast = { id: 'test', message: 'This is a test warning', type: 'warning' };

// Mocks ----------------------------------------------------------------------
const mockDismiss = jest.fn();
jest.mock('../ToastService', () => ({
  useDismissToast: () => mockDismiss,
}));

// Tests ----------------------------------------------------------------------
describe('Toast Component', () => {
  describe('Render', () => {
    it('Should have the message displayed', () => {
      render(<ToastComponent toast={stubInfoToast} />);
      const msg = screen.getByRole('alertdialog');
      expect(msg).toHaveTextContent(stubInfoToast.message);
    });
    it('Should have the correct color depending on the type', () => {
      render(<ToastComponent toast={stubInfoToast} />);
      render(<ToastComponent toast={stubErrorToast} />);
      render(<ToastComponent toast={stubSuccessToast} />);
      render(<ToastComponent toast={stubWarningToast} />);

      const toastAccents = screen.getAllByTestId('accent');
      expect(toastAccents[0]).toHaveClass('bg-golden-500'); // info
      expect(toastAccents[1]).toHaveClass('!bg-cinnabar-500'); // error
      // TODO: Set colors for success and warning
      // expect(toastAccents[2]).toHaveClass('!bg-golden-500'); // success
      // expect(toastAccents[3]).toHaveClass('!bg-golden-500'); // warning
    });
  });

  describe('Behaviour', () => {
    it('should dismiss itself after 4 seconds', () => {
      jest.useFakeTimers();
      render(<ToastComponent toast={stubInfoToast} />);
      expect(mockDismiss).toHaveBeenCalledTimes(0);

      act(() => {
        jest.runOnlyPendingTimers();
      });
      expect(mockDismiss).toHaveBeenCalledTimes(1);
    });
  });
});
