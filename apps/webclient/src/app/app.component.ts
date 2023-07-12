import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'webclient-root',
  template: '<h1>TEST</h1>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
