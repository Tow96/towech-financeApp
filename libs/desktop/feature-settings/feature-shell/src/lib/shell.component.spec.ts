// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Tested elements
import { DesktopFeatureSettingsShellComponent } from './shell.component';

describe('Desktop Settings Page', () => {
  let component: DesktopFeatureSettingsShellComponent;
  let fixture: ComponentFixture<DesktopFeatureSettingsShellComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopFeatureSettingsShellComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it.skip('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  //TEST GOES HERE
});
