// Libraries ------------------------------------------------------------------
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
// Tested Components ----------------------------------------------------------
import { NavbarItem } from '../NavbarItem';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

// Tests ----------------------------------------------------------------------
const renderBttnAndLink = (
  icon: IconProp = 'hamburger',
  collapsed = false,
  name = 'test',
  click = () => {},
  href = 'destination',
  current = 'home',
  setCollapsed = () => {}
) => {
  render(<NavbarItem icon={icon} collapsed={collapsed} name={name} type="button" click={click} />);
  render(
    <NavbarItem
      collapsed={collapsed}
      name={name}
      type="link"
      href={href}
      setCollapsed={setCollapsed}
      current={current}
      icon={icon}
    />
  );

  const bttn = screen.getByRole('button');
  const link = screen.getByRole('link');

  return { bttn, link };
};

describe('NavbarItem Component', () => {
  describe('Render', () => {
    describe('type', () => {
      it('Should render a button when selected', () => {
        render(
          <NavbarItem
            collapsed={false}
            name="test"
            type="button"
            click={() => {}}
            icon={'hamburger'}
          />
        );
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
      });
      it('Should render a link when selected', () => {
        render(
          <NavbarItem
            collapsed={false}
            name="test"
            type="link"
            href="/"
            setCollapsed={() => {}}
            current="/"
            icon={'hamburger'}
          />
        );
        const button = screen.getByRole('link');
        expect(button).toBeInTheDocument();
      });
    });
    describe('collapsed', () => {
      it('should render an icon', () => {
        const { bttn, link } = renderBttnAndLink('hamburger', true);

        const bttnIcon = within(bttn).getByTestId('icon');
        const linkIcon = within(link).getByTestId('icon');

        expect(bttnIcon).toBeInTheDocument();
        expect(linkIcon).toBeInTheDocument();
      });
      it('should not display any kind of text', () => {
        const title = 'content';
        const { bttn, link } = renderBttnAndLink('hamburger', true, title);

        expect(bttn).not.toHaveTextContent(title);
        expect(link).not.toHaveTextContent(title);
      });
    });
    describe('not collapsed', () => {
      it('should render an icon', () => {
        const { bttn, link } = renderBttnAndLink('hamburger', false);

        const bttnIcon = within(bttn).getByTestId('icon');
        const linkIcon = within(link).getByTestId('icon');

        expect(bttnIcon).toBeInTheDocument();
        expect(linkIcon).toBeInTheDocument();
      });
      it('should display the text of the title', () => {
        const title = 'content';
        const { bttn, link } = renderBttnAndLink('hamburger', false, title);

        expect(bttn).toHaveTextContent(title);
        expect(link).toHaveTextContent(title);
      });
    });
  });
  describe('Behaviour', () => {
    describe('Button', () => {
      it('should call the given function when clicked', () => {
        const clickFn = jest.fn();
        render(
          <NavbarItem
            collapsed={false}
            name="test"
            type="button"
            click={clickFn}
            icon={'hamburger'}
          />
        );

        const button = screen.getByRole('button');
        button.click();

        expect(clickFn).toHaveBeenCalledTimes(1);
      });
    });
    describe('Link', () => {
      it('should be enabled when the href and current path are different', () => {
        render(
          <NavbarItem
            collapsed={false}
            name="test"
            type="link"
            href="/"
            setCollapsed={() => {}}
            current="/somewhere"
            icon={'hamburger'}
          />
        );

        const link = screen.getByRole('link');

        expect(link).toHaveAttribute('aria-disabled', 'false');
        expect(link).not.toHaveClass('pointer-events-none');
      });
      it('should be disabled when the href and current path are the same', () => {
        render(
          <NavbarItem
            collapsed={false}
            name="test"
            type="link"
            href="/"
            setCollapsed={() => {}}
            current="/"
            icon={'hamburger'}
          />
        );

        const link = screen.getByRole('link');

        expect(link).toHaveAttribute('aria-disabled', 'true');
        expect(link).toHaveClass('pointer-events-none');
      });
      it('should collapse when enabled and clicked', () => {
        const collapse = jest.fn();
        render(
          <NavbarItem
            collapsed={false}
            name="test"
            type="link"
            href="/"
            setCollapsed={collapse}
            current="/"
            icon={'hamburger'}
          />
        );

        const link = screen.getByRole('link');
        link.click();

        expect(collapse).toHaveBeenCalledWith(true);
      });
    });
  });
});
