import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button component', () => {
  // Type -------------------------------------
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
  // Color ------------------------------------
  it('should contain the "golden" color as default', () => {
    render(<Button>bttn</Button>);
    const bttn = screen.getByRole('button');
    expect(bttn).toHaveClass('bg-golden-500');
    expect(bttn).toHaveClass('hover:bg-golden-400');
    expect(bttn).toHaveClass('active:bg-golden-600');
    expect(bttn).toHaveClass('text-riverbed-950');
    expect(bttn).toHaveClass('focus-visible:focused-button-shadow');
  });
  // Content ----------------------------------
  it('should render the child content', () => {
    const num = Math.floor(Math.random() * 12345);
    const content = <a data-testid="content">{num}</a>;
    render(<Button>{content}</Button>);
    const bttn = screen.getByRole('button');

    expect(bttn).toHaveTextContent(num.toString());
  });
});
