import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ToastService } from './toast.service';

// Following example from:
// https://dev.to/riapacheco/custom-reusable-toast-component-with-angular-animations-async-pipe-and-rxjs-behaviorsubject-2bdf

@Component({
  standalone: true,
  selector: 'webclient-toasttest',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  imports: [CommonModule],
  animations: [
    trigger('toastTrigger', [
      state('open', style({ transform: 'translateY(0%)' })),
      state('close', style({ transform: 'translateY(-200%)' })),
      transition('open <=> close', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class ToastComponent {
  constructor(public toast: ToastService) {}

  dismiss(): void {
    this.toast.dismissToast();
  }
}
