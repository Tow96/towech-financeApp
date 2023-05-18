// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Tested elements
import { DesktopNavbarComponent } from './desktop-navbar-feature.component';
import { Store, StoreModule } from '@ngrx/store';
import { UserActions } from '@towech-finance/desktop/shell/data-access/user-state';

describe('Desktop Navbar', () => {
  let component: DesktopNavbarComponent;
  let fixture: ComponentFixture<DesktopNavbarComponent>;
  let compiled: HTMLElement;
  let store: Store;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
    });
    fixture = TestBed.createComponent(DesktopNavbarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;

    store = TestBed.inject(Store);
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
});
