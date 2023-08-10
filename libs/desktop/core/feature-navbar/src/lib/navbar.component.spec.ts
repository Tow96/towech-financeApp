// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
import { provideStore } from '@ngrx/store';
import { adaptReducer } from '@state-adapt/core';
// Tested elements
import { DesktopNavbarComponent } from './navbar.component';
// Mocks
import { RouterTestingModule } from '@angular/router/testing';
import { DesktopUserServiceMock } from '@finance/desktop/shared/utils-testing';
// Services
import { DesktopUserService } from '@finance/desktop/shared/data-access-user';
import { navContents } from './utils';

describe('Desktop Navbar', () => {
  let component: DesktopNavbarComponent;
  let fixture: ComponentFixture<DesktopNavbarComponent>;
  let compiled: HTMLElement;
  let service: DesktopUserService;
  let router: Router;
  let spy: SubscriberSpy<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          ...navContents.map(x => ({ path: x.route, component: DesktopNavbarComponent })),
          { path: 'fake', component: DesktopNavbarComponent },
        ]),
      ],
      providers: [
        provideStore({ adapt: adaptReducer }),
        { provide: DesktopUserService, useValue: DesktopUserServiceMock },
      ],
    });
    fixture = TestBed.createComponent(DesktopNavbarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;

    service = TestBed.inject(DesktopUserService);
    router = TestBed.inject(Router);
  });

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  describe('When logout button is clicked', () => {
    it('Should next a logout event', () => {
      spy = subscribeSpyTo(service.logout$);

      const logoutBttn = fixture.debugElement.nativeElement.querySelector('#logout > button');
      logoutBttn.click();
      expect(spy.receivedNext()).toBe(true);
    });
  });

  describe('When menu button is clicked', () => {
    it('Should toggle the collapse state', () => {
      spy = subscribeSpyTo(component.store.isCollapsed$);

      const menuBttn = fixture.debugElement.nativeElement.querySelector('#navbar-menu > button');
      menuBttn.click();
      expect(spy.getLastValue()).toBe(false);
      menuBttn.click();
      expect(spy.getLastValue()).toBe(true);
    });
  });

  describe('When a click happens and the navbar is deployed', () => {
    let clickedTarget: any;

    beforeEach(() => {
      spy = subscribeSpyTo(component.store.isCollapsed$);

      if (spy.getLastValue()) component.toggleCollapse$.next();

      fixture.detectChanges();
      compiled = fixture.nativeElement;
    });

    describe('When clicking inside the navbar', () => {
      it('Should do nothing', () => {
        clickedTarget = compiled.children[0];
        component.clickListener({ target: clickedTarget } as PointerEvent);
        expect(spy.getLastValue()).toBe(false);
      });
    });

    describe('When clicking outside the navbar', () => {
      it('Should close the navbar', () => {
        clickedTarget = document.createElement('p');
        component.clickListener({ target: clickedTarget } as PointerEvent);
        expect(spy.getLastValue()).toBe(true);
      });
    });
  });

  describe('When a navbar icon is clicked', () => {
    let routeSpy: jest.SpyInstance;
    let bttn: HTMLElement;

    beforeEach(() => {
      bttn = fixture.debugElement.nativeElement.querySelector(
        `#navbar-${navContents[1].route} > button`
      );
      spy = subscribeSpyTo(component.store.state$);
      routeSpy = jest.spyOn(router, 'navigate');

      if (spy.getLastValue()) component.toggleCollapse$.next();

      bttn.click();
    });

    it('Should navigate to the correct screen', () => {
      expect(routeSpy).toHaveBeenCalledTimes(1);
      expect(routeSpy).toHaveBeenCalledWith([navContents[1].route]);
    });

    it('Should collapse the menu', () => {
      expect(spy.getLastValue().collapsed).toBe(true);
    });

    it('Should update the title', () => {
      expect(spy.getLastValue().title).toBe(navContents[1].title);
    });
  });
});
