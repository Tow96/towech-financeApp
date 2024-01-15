import '@testing-library/jest-dom';

jest.mock('./src/components/modal.tsx', () => ({
  Modal: ({ onOk }) => (
    <div data-testid="modal">
      <button onClick={onOk}>Ok</button>
    </div>
  ),
}));
