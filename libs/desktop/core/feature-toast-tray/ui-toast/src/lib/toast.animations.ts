/** desktop-toaster-ui.animations.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Component that contains the animations for the component
 */
import { trigger, style, animate, transition, keyframes } from '@angular/animations';

const messageTime = '300ms ease-in';
const messageOffset = 0.16;

export const colorTransition = trigger('color', [
  transition('void => *', [
    animate('50ms ease-in', keyframes([style({ height: 0, offset: 0 }), style({ offset: 1 })])),
  ]),
]);

export const messageBodyTransition = trigger('message_body', [
  transition(':enter', [
    animate(
      messageTime,
      keyframes([
        style({ padding: '0', width: '0', offset: 0 }),
        style({ width: '0', offset: messageOffset }),
        style({ offset: 1 }),
      ])
    ),
  ]),
]);

export const messageTextTransition = trigger('message_text', [
  transition(':enter', [
    animate(
      messageTime,
      keyframes([
        style({ 'font-size': 0, color: 'transparent', offset: 0 }),
        style({ 'font-size': 0, color: 'transparent', offset: 0.99 }),
        style({ offset: 1 }),
      ])
    ),
  ]),
]);
