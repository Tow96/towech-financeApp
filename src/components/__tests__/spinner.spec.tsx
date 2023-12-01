import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Spinner } from '../spinner';

describe('Spinner component', () => {
  it('should render the component', () => {
    render(<Spinner />);
    const elem = screen.getByTestId('spinner');
    expect(elem).toBeInTheDocument();
  });
});
