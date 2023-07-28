// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
// Tested elements
import { DesktopNavbarItemComponent } from './desktop-navbar-ui-item.component';

describe('NavBar Item', () => {
  let component: DesktopNavbarItemComponent;
  let fixture: ComponentFixture<DesktopNavbarItemComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopNavbarItemComponent);
    component = fixture.componentInstance;
    component.label = 'Test';

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  describe('When the item is clicked', () => {
    it('Should next the clicked event', () => {
      const clickEvent = subscribeSpyTo(component.clicked);
      const button = fixture.debugElement.nativeElement.querySelector('button');
      button.click();

      expect(clickEvent.receivedNext()).toBe(true);
    });
  });
});
