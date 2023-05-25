// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Tested elements
import { ButtonComponent } from './shared-ui-button.component';

describe('Button Component', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it.skip('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  //TEST GOES HERE
});
