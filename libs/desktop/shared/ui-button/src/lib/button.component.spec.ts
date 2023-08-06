// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Tested elements
import { DesktopSharedUiButtonComponent } from './shared-ui-button.component';

describe('Button Component', () => {
  let component: DesktopSharedUiButtonComponent;
  let fixture: ComponentFixture<DesktopSharedUiButtonComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopSharedUiButtonComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  //TEST GOES HERE
});
