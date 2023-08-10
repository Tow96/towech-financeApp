/** spinner.component.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Component that creates a variable size spinner component
 * The animation was obtained from: https://loading.io/css/
 */

import { Component, Input, HostBinding } from '@angular/core';

@Component({
  standalone: true,
  selector: 'finance-spinner',
  imports: [],
  styles: [
    `
      .lds-dual-ring {
        /* --spinner-size: 30px; */
        --color: #ddd; /* TODO: Add color variability */
        display: inline-block;
        width: var(--spinner-size);
        height: var(--spinner-size);
      }
      .lds-dual-ring:after {
        content: ' ';
        display: block;
        width: calc(var(--spinner-size) * 4 / 5);
        height: calc(var(--spinner-size) * 4 / 5);
        /* margin: calc(var(--spinner-size) / 10); */
        border-radius: 50%;
        border: calc(var(--spinner-size) / 10) solid var(--color);
        border-color: var(--color) transparent var(--color) transparent;
        animation: lds-dual-ring 1.2s linear infinite;
        /* z-index: 2147483640; */
      }

      /* TODO: Move this to ng animation if needed */
      @keyframes lds-dual-ring {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],

  template: ` <div class="lds-dual-ring"></div> `,
})
export class DesktopSpinnerComponent {
  @HostBinding('style.--spinner-size')
  @Input()
  public size = '30px';
}
