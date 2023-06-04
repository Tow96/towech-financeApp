// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Tested elements
import { SettingsFeatureComponent } from './desktop-settings-feature.component';

describe('Desktop Settings Page', () => {
  let component: SettingsFeatureComponent;
  let fixture: ComponentFixture<SettingsFeatureComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsFeatureComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it.skip('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  //TEST GOES HERE
});
