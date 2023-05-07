// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Tested Elements
import { DesktopToastUIComponent } from './desktop-toaster-ui.component';
import { DesktopToast } from '@towech-finance/desktop/toasts/data-access';

const stubToast = (): DesktopToast => ({
  id: 'test-id',
  message: 'Toast content',
  duration: 2000,
});

describe('Toast Component', () => {
  let component: DesktopToastUIComponent;
  let fixture: ComponentFixture<DesktopToastUIComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopToastUIComponent);
    component = fixture.componentInstance;
    component.toast = stubToast();
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Must match the snapshot', () => {
    expect(compiled).toMatchSnapshot();
  });
});
