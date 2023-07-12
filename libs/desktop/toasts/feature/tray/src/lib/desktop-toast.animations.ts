/** desktop-toast.animations.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Contains the animation transitions for the component
 */
import { trigger, style, animate, transition, keyframes } from '@angular/animations';

export const toastTransition = trigger('toast', [
  transition(':leave', [
    animate(
      '300ms ease-out',
      keyframes([style({ opacity: 1, offset: 0 }), style({ width: 0, opacity: 0, offset: 1 })])
    ),
  ]),
]);
