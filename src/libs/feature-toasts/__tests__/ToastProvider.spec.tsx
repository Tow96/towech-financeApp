import { Toast } from "../ToastService"
import { ToastProvider } from "../ToastProvider"
import { render, screen } from '@testing-library/react'

let toasts: Toast[] = [{id: '0', message: 'a', type: 'info'}]

jest.mock('../ToastService', () => {
  return {
    useToasts: jest.fn(() => toasts),
    useDismissToast: jest.fn(() => {})
  }
})

describe('Toast Provider', () => {
  describe('Behaviour', () => {
    let renderedToasts: HTMLElement[];

    test('Should render appropriate amount of toasts', () => {
      render(<ToastProvider><div>test</div></ToastProvider>)
      renderedToasts = screen.getAllByRole('alert');
      expect(renderedToasts.length).toBe(toasts.length);
    })
  })
})