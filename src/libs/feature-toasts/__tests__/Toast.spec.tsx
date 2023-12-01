import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { ToastComponent } from '../Toast';
import { Toast } from '../ToastService';

const stubToast: Toast = { id: 'test', message: 'This is a test toast', type: 'info' };
const mockDismiss = jest.fn();
jest.mock('../ToastService', () => ({
  useDismissToast: () => mockDismiss,
}));

describe('Toast Component', () => {
  beforeEach(() => {});

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
