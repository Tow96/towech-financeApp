// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Tested elements
import { DesktopSpinnerComponent } from './spinner.component';

describe('desktop-spinner', () => {
  let component: DesktopSpinnerComponent;
  let fixture: ComponentFixture<DesktopSpinnerComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopSpinnerComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());
});
