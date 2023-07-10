// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Tested elements
import { DesktopNavbarComponent } from './desktop-navbar-feature.component';
import { Store, StoreModule } from '@ngrx/store';
import { UserActions } from '@towech-finance/desktop/shell/data-access/user-state';
import { provideRouter } from '@angular/router';

describe('Desktop Navbar', () => {
  let component: DesktopNavbarComponent;
  let fixture: ComponentFixture<DesktopNavbarComponent>;
  let compiled: HTMLElement;
  let store: Store;
  let router: Router;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), BrowserAnimationsModule],
      providers: [provideRouter([{ path: 'test', component: DesktopNavbarComponent }])],
    });
    fixture = TestBed.createComponent(DesktopNavbarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  describe('onLogoutClick', () => {
    it('Should dispatch a logout action', () => {
      const spy = jest.spyOn(store, 'dispatch');
      component.onLogoutClick();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(UserActions.logout());
    });
  });

  describe('onToggleCollapse', () => {
    it('Should toggle the value of the collapsed variable', () => {
      component.collapsed = false;
      component.onToggleCollapse();
      expect(component.collapsed).toBe(true);
      component.onToggleCollapse();
      expect(component.collapsed).toBe(false);
    });
  });

  describe('navigateTo', () => {
    it('Should navigate to the correct screen', () => {
      jest.clearAllMocks();
      const spy = jest.spyOn(router, 'navigate');
      component.navigateTo('test');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(['test']);
    });

    it('Should collapse the menu if it is open', () => {
      component.collapsed = false;
      component.navigateTo('test');
      expect(component.collapsed).toBe(true);
    });
  });

  describe('isRouteActive', () => {
    describe('When it is called with the same route as the current', () => {
      it('Should return true', () => {
        expect(component.isRouteActive('')).toBe(true);
      });
    });

    describe('When it is called with a different route as the current', () => {
      it('Should return true', () => {
        expect(component.isRouteActive('test')).toBe(false);
      });
    });
  });

  describe('When onOutside click is called', () => {
    let clickedTarget: any;

    describe('When clicking inside the navbar', () => {
      it('Should do nothing', () => {
        clickedTarget = compiled.children[0];
        component.collapsed = true;
        component.clickListener({ target: clickedTarget } as PointerEvent);
        expect((component.collapsed = true));

        component.collapsed = false;
        component.clickListener({ target: clickedTarget } as PointerEvent);
        expect((component.collapsed = false));
      });
    });

    describe('When clicking outside the navbar', () => {
      it('Should close the navbar', () => {
        clickedTarget = document.createElement('p');
        component.collapsed = true;
        component.clickListener({ target: clickedTarget } as PointerEvent);
        expect((component.collapsed = true));

        component.collapsed = false;
        component.clickListener({ target: clickedTarget } as PointerEvent);
        expect((component.collapsed = true));
      });
    });
  });

  describe('When getNavClass is called', () => {
    it('Should return the correct classes', () => {
      component.collapsed = true;
      let result = component.getNavClass();
      expect(result).toEqual({
        deployed: false,
      });

      component.collapsed = false;
      result = component.getNavClass();
      expect(result).toEqual({
        deployed: true,
      });
    });
  });
});
