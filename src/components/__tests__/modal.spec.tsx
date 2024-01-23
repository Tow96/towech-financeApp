// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

// Tested Components ----------------------------------------------------------
import { Modal } from '../modal';

// Stubs ----------------------------------------------------------------------

// Mocks ----------------------------------------------------------------------
const mockParams = jest.fn(() => ({ get: (a: string) => (a === 'showDialog' ? 'y' : null) }));
const mockRouter = jest.fn();
const mockPathname = jest.fn();
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockParams(),
  useRouter: () => mockRouter(),
  usePathname: () => mockPathname(),
}));

// Tests ----------------------------------------------------------------------
describe('Modal component', () => {
  describe('Render', () => {
    it('Should not render anything if the search param is not present', () => {
      mockParams.mockImplementationOnce(() => ({ get: () => null }) as any);
      render(<Modal title="test"></Modal>);

      expect(() => screen.getByRole('dialog')).toThrow();
    });
    it('Should render the given title as a heading', () => {
      const stubTitle = 'Test modal';

      render(<Modal title={stubTitle}></Modal>);
      const dialog = screen.getByRole('dialog');
      const title = within(dialog).getByRole('heading');

      expect(title).toHaveTextContent(stubTitle);
    });
  });
  describe('Behaviour', () => {
    it('Should call the onClose fn when closed', async () => {
      const onClose = jest.fn();
      const onConfi = jest.fn();
      render(<Modal title="test" onClose={onClose} onOk={onConfi}></Modal>);
      const dialog = screen.getByRole('dialog');
      const closeBttn = within(dialog).getByTestId('close-button');

      await userEvent.click(closeBttn);
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onConfi).not.toHaveBeenCalled();
    });
    it('Should call the onOK fn when ok is clicked', async () => {
      const onClose = jest.fn();
      const onConfi = jest.fn();
      render(<Modal title="test" onClose={onClose} onOk={onConfi}></Modal>);
      const dialog = screen.getByRole('dialog');
      const closeBttn = within(dialog).getByText('Ok');

      await userEvent.click(closeBttn);
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onConfi).toHaveBeenCalledTimes(1);
    });
    it.todo('Test the param removal when closing when jest-dom adds it');
  });
});
