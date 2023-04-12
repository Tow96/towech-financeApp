// Libraries
import { Component } from '@angular/core';
// Modules
import { RouterModule } from '@angular/router';
// Components
import { ToastComponent } from './toasttest/toast.component';

@Component({
  standalone: true,
  imports: [RouterModule, ToastComponent],
  selector: 'webclient-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'webclient';
}
