/** Toast.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Toast component
 */
'use client';
import { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { Toast, useDismissToast } from '@/libs/feature-toasts/ToastService';
import { classNames } from '@/utils/ConditionalClasses';

export const ToastComponent = ({ toast }: { toast: Toast }): JSX.Element => {
  const duration = 3000;

  const [visible, setVisible] = useState(false);
  const dismiss = useDismissToast();
  useEffect(() => {
    setVisible(true);
    setTimeout(() => setVisible(false), duration); // eslint-disable-line max-nested-callbacks
    setTimeout(() => dismiss(toast.id), duration + 1000); // eslint-disable-line max-nested-callbacks
  }, [dismiss, toast]);

  // TODO: Add toast colors
  let text = classNames({ 'text-transparent': !visible });
  let color = classNames({ 'bg-golden-500': true });

  const transitionRef = useRef(null);
  const transitionCls = {
    enter: 'translate-x-96 opacity-0',
    enterActive: 'duration-500 transition-all !translate-x-0 opacity-100',
    enterDone: '!translate-x-0 opacity-100',
    exit: 'translate-x-0 opacity-100',
    exitActive: 'transition-all duration-500 !translate-x-96 opacity-0',
    exitDone: '!translate-x-96 opacity-0',
  };

  return (
    <CSSTransition nodeRef={transitionRef} timeout={1000} classNames={transitionCls} in={visible}>
      <div
        role="alert"
        ref={transitionRef}
        className="mb-4 flex h-12 translate-x-96 items-center rounded-md bg-riverbed-900 shadow-lg drop-shadow-lg">
        <div data-testid="accent" className={`h-full w-4 rounded-l-md ${color}`}></div>
        <div role="alertdialog" className={`w-36 pl-4 pr-2 ${text}`}>
          {toast.message}
        </div>
      </div>
    </CSSTransition>
  );
};
