'use client';
import { ButtonHTMLAttributes, ReactElement, useState } from 'react';
import { classNames } from '../ConditionalClasses';
import { SpinnerComponent } from './Spinner.Component';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Types ----------------------------------------------------------------------
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'accent' | 'danger';
  icon?: IconProp;
  text: string;
  size?: 'sm' | 'md';
  loading?: boolean;
}

export const Button = ({
  type = 'button',
  color = 'accent',
  disabled = false,
  loading = false,
  icon,
  size = 'md',
  text,
  children,
  ...props
}: Props): ReactElement => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const buttonClasses = classNames({
    // Frame
    'px-2 py-2 m-1 min-h-8': true,
    'rounded-lg button-shadow': true,
    'transition duration-200': true,
    'flex items-center relative': true,

    // Base Colors
    'bg-golden-400 text-golden-950': color === 'accent',
    'bg-cinnabar-300 text-cinnabar-900': color === 'danger',

    // Hover
    'hover:bg-golden-300': color === 'accent',
    'hover:bg-cinnabar-200': color === 'danger',

    // Clicked
    'active:input-shadow': true,
    'active:bg-golden-500': color === 'accent',
    'active:bg-cinnabar-400': color === 'danger',

    // Focused
    'focus-visible:outline-none': true,
    'focus-visible:focused-button-shadow': color === 'accent',
    'focus-visible:focused-danger-button-shadow': color === 'danger',

    // Disabled
    'disabled:button-shadow-disabled disabled:opacity-75': true,
    'disabled:bg-golden-400': color === 'accent',
    'disabled:bg-cinnabar-300': color === 'danger',
  });
  const spinnerClasses = classNames({
    'border-golden-950': color === 'accent',
    'border-cinnabar-900': color === 'danger',
  });
  const textClasses = classNames({
    'font-semibold': true,
    'ml-2': loading || icon !== undefined,
  });

  const iconElement = icon ? <FontAwesomeIcon icon={icon} size="xs" width={16} /> : null;
  return (
    <button
      {...props}
      disabled={disabled}
      type={type}
      aria-busy={loading}
      className={buttonClasses}
      onMouseEnter={() => setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(false)}
    >
      {/* Icon / loading */}
      {loading ? <SpinnerComponent size="xs" className={spinnerClasses} /> : iconElement}
      {/* Text in button (only sizes higher than sm) */}
      {size === 'md' && <div className={textClasses}>{text}</div>}
      {/* Text in tooltip (only in sm) */}
      {size === 'sm' && isTooltipVisible && (
        <div className="absolute top-[110%] z-50 -translate-x-[25%] rounded-lg bg-black p-2 text-sm text-white">
          {text}
        </div>
      )}
    </button>
  );
};
