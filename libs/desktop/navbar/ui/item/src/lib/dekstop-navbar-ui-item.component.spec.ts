// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Tested elements
import { DesktopNavbarItemComponent } from './desktop-navbar-ui-item.component';

describe('NavBar Item', () => {
  let component: DesktopNavbarItemComponent;
  let fixture: ComponentFixture<DesktopNavbarItemComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopNavbarItemComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it.skip('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  //TEST GOES HERE
});
