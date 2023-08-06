// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Tested elements
import { DesktopSettingsComponent } from './shell.component';

describe('Desktop Settings Page', () => {
  let component: DesktopSettingsComponent;
  let fixture: ComponentFixture<DesktopSettingsComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopSettingsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it.skip('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  //TEST GOES HERE
});
