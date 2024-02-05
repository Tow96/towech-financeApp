// Libraries ------------------------------------------------------------------
import { render, screen } from '@testing-library/react';
import { Toast } from '@/libs/feature-toasts/ToastService';
// Tested Components ----------------------------------------------------------
import { ToastProvider } from '@/libs/feature-toasts/ToastProvider';

// Stubs ----------------------------------------------------------------------
let stubToasts: Toast[] = [{ id: '0', message: 'a', type: 'info' }];

// Mocks ----------------------------------------------------------------------
jest.mock('../../ToastService', () => {
  return {
    useToasts: jest.fn(() => stubToasts),
    useDismissToast: jest.fn(() => {}),
  };
});

// Tests ----------------------------------------------------------------------
describe('Toast Provider', () => {
  describe('Behaviour', () => {
    let renderedToasts: HTMLElement[];

    test('Should render appropriate amount of toasts', () => {
      render(
        <ToastProvider>
          <div>test</div>
        </ToastProvider>
      );
      renderedToasts = screen.getAllByRole('alert');
      expect(renderedToasts.length).toBe(stubToasts.length);
    });
  });
});
