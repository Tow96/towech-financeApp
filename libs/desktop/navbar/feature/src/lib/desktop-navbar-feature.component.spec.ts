// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
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
      imports: [StoreModule.forRoot({})],
      providers: [provideRouter([{ path: 'test', redirectTo: '' }])],
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
  });
});
