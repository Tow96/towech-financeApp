import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Checkbox } from '../checkbox';

describe('Checkbox component', () => {
  describe('Render', () => {
    it('should render a checkbox input', () => {
      render(<Checkbox label="check" />);
      const input = screen.getByTestId('checkbox');
      expect(input).toHaveAttribute('type', 'checkbox');
    });
    it('should render a label with the given value', () => {
      const num = Math.floor(Math.random() * 12345).toString();
      render(<Checkbox label={num} />);
      const label = screen.getByLabelText(num);
      expect(label).toBeInTheDocument();
    });
  });

  describe('Behaviour', () => {
    test('the checkbox value should change when the label is clicked', async () => {
      render(<Checkbox label="check" />);
      const input = screen.getByTestId('checkbox');
      const label = screen.getByLabelText('check');

      await userEvent.click(label);
      expect(input).toBeChecked();

      await userEvent.click(label);
      expect(input).not.toBeChecked();
    });
  });
});
