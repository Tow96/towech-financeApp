// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Tested elements
import { DesktopSpinner } from './spinner.component';

describe('desktop-spinner', () => {
  let component: DesktopSpinner;
  let fixture: ComponentFixture<DesktopSpinner>;
  let compiled: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopSpinner);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());
});
