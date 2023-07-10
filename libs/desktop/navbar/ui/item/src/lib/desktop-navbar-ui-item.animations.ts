/** desktop-navbar-ui-item.animations.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Contains the animation transitions for the component
 */
import { trigger, style, animate, transition, keyframes } from '@angular/animations';

export const menuTransitions = trigger('pesto', [
  transition(':enter', [
    animate(
      '200ms ease-in',
      keyframes([
        style({ opacity: 0, width: 0, offset: 0 }),
        style({ opacity: 0, width: '*', offset: 0.99 }),
        style({ opacity: 1, offset: 1 }),
      ])
    ),
  ]),
  transition(':leave', [
    animate(
      '200ms ease-out',
      keyframes([
        style({ opacity: 1, width: '*', offset: 0 }),
        style({ opacity: 0, width: '*', offset: 0.01 }),
        style({ width: 0, offset: 1 }),
      ])
    ),
  ]),
]);
