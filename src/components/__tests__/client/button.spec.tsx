// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// Tested Components ----------------------------------------------------------
import { Button } from '../../button';

// Tests ----------------------------------------------------------------------
describe('Button component', () => {
  describe('Render', () => {
    describe('Type', () => {
      it('should have a button of type "button" as default', () => {
        render(<Button>bttn</Button>);
        const bttn = screen.getByRole('button');
        expect(bttn).toHaveAttribute('type', 'button');
      });
      it('should have a button of type "reset" when given', () => {
        render(<Button type="reset">bttn</Button>);
        const bttn = screen.getByRole('button');
        expect(bttn).toHaveAttribute('type', 'reset');
      });
      it('should have a button of type "submit" when given', () => {
        render(<Button type="submit">bttn</Button>);
        const bttn = screen.getByRole('button');
        expect(bttn).toHaveAttribute('type', 'submit');
      });
    });
    describe('CSS', () => {
      it('should contain the "golden" color as default', () => {
        render(<Button>bttn</Button>);
        const bttn = screen.getByRole('button');
        expect(bttn).toHaveClass('bg-golden-400 text-golden-950');
        expect(bttn).toHaveClass('hover:bg-golden-300');
        expect(bttn).toHaveClass('active:bg-golden-500');
        expect(bttn).toHaveClass('focus-visible:focused-button-shadow');
        expect(bttn).toHaveClass('disabled:bg-golden-400');
      });
    });
    it('should render the child content', () => {
      const num = Math.floor(Math.random() * 12345);
      const content = <a data-testid="content">{num}</a>;
      render(<Button>{content}</Button>);
      const bttn = screen.getByRole('button');

      expect(bttn).toHaveTextContent(num.toString());
    });
    it('should render a spinner if it has the loading attribute', () => {
      render(<Button loading={true}>a</Button>);
      const spinner = screen.getByRole('status');

      expect(spinner).toBeInTheDocument();
    });
  });
  describe('Behaviour', () => {
    it('Should execute the given function when clicked', async () => {
      const fn = jest.fn();
      render(<Button onClick={fn}>Button</Button>);

      const bttn = screen.getByRole('button');
      await userEvent.click(bttn);

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
