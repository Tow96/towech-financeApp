// // Libraries ------------------------------------------------------------------
// import '@testing-library/jest-dom';
// import { render, screen, within } from '@testing-library/react';
// import { userEvent } from '@testing-library/user-event';
// import * as Navigation from 'next/navigation';
// // Tested Components ----------------------------------------------------------
// import { Modal } from '../modal';

// // Stubs ----------------------------------------------------------------------

// // Mocks ----------------------------------------------------------------------
// jest.mock('next/navigation', () => ({
//   useSearchParams: jest.fn(),
// }));
// const mockSearchParams = jest.spyOn(Navigation, 'useSearchParams');

// // Tests ----------------------------------------------------------------------
// describe('Modal component', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     mockSearchParams.mockImplementation(
//       () => ({ get: (a: string) => (a === 'showDialog' ? 'y' : null) }) as any
//     );
//   });

//   describe('Render', () => {
//     it('Should not render anything if the search param is not present', () => {
//       mockSearchParams.mockImplementation(() => ({ get: () => null }) as any);
//       render(<Modal title="test"></Modal>);

//       expect(() => screen.getByRole('dialog')).toThrow();
//     });
//     it('Should render the given title as a heading', () => {
//       const stubTitle = 'Test modal';

//       render(<Modal title={stubTitle}></Modal>);
//       // const dialog = screen.getByRole('dialog');
//       // const title = within(dialog).getByRole('heading');

//       // expect(title).toHaveTextContent(stubTitle);
//     });
//   });
// });
it.todo('Modal tests when jest supports the dialog element');
