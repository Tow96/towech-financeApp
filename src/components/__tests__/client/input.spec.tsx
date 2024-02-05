// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// Tested Components ----------------------------------------------------------
import { Input } from '../../input';

// Tests ----------------------------------------------------------------------
describe('Input component', () => {
  // Type ---------------------------------------
  it('should have a type of "text" as default', () => {
    render(<Input label="input" />);
    const input = screen.getByPlaceholderText('');
    expect(input).toHaveAttribute('type', 'text');
  });
  it('should have a type of "password" when given', () => {
    render(<Input label="input" type="password" />);
    const input = screen.getByPlaceholderText('');
    expect(input).toHaveAttribute('type', 'password');
  });
  // Label --------------------------------------
  it('should render the given value for a label', () => {
    const num = Math.floor(Math.random() * 12345).toString();
    render(<Input label={num} />);
    const label = screen.getByTestId('label');
    expect(label).toHaveTextContent(num);
  });
  // Error --------------------------------------
  it('should change a couple of classes if the input has an error', () => {
    render(<Input label="input" error />);
    const input = screen.getByPlaceholderText('');
    const label = screen.getByTestId('label');

    expect(input).toHaveClass('focus-visible:focused-input-error');
    expect(label).toHaveClass('text-cinnabar-500');
    expect(label).toHaveClass('font-semibold');
  });
});
