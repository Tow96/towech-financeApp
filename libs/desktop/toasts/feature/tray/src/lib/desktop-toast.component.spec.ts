// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesktopToasterComponent } from './desktop-toast.component';
// Tested Elements

describe('Desktop Toaster', () => {
  let component: DesktopToasterComponent;
  let fixture: ComponentFixture<DesktopToasterComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopToasterComponent);
    component = fixture.componentInstance;
    component.service.addAccent('ADD TEST 0');
    component.service.addError('ADD TEST 1');
    component.service.addSuccess('ADD TEST 2');
    component.service.addWarning('ADD TEST 3');

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Must match the snapshot', () => {
    expect(compiled).toMatchSnapshot();
  });
});
