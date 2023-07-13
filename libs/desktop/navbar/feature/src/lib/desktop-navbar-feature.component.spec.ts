// Libraries
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { Observable } from 'rxjs';
// Tested elements
import { DesktopNavbarComponent } from './desktop-navbar-feature.component';
// Mocks
import { provideRouter } from '@angular/router';
import { DesktopUserService } from '@towech-finance/desktop/user/data-access';
import { Source } from '@state-adapt/rxjs';

const mockStore = {
  logout$: new Source<void>('aaa'),
};

describe('Desktop Navbar', () => {
  let component: DesktopNavbarComponent;
  let fixture: ComponentFixture<DesktopNavbarComponent>;
  let compiled: HTMLElement;
  let service: DesktopUserService;
  let router: Router;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [
        { provide: DesktopUserService, useValue: mockStore },
        provideRouter([{ path: 'test', component: DesktopNavbarComponent }]),
      ],
    });
    fixture = TestBed.createComponent(DesktopNavbarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;

    service = TestBed.inject(DesktopUserService);
    // router = TestBed.inject(Router);
  });

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  describe('When logout button is clicked', () => {
    it('Should next a logout event', () => {
      const spy = subscribeSpyTo(service.logout$);

      const logoutBttn = fixture.debugElement.nativeElement.querySelector('#logout > button');
      logoutBttn.click();
      expect(spy.receivedNext()).toBe(true);
    });
  });

  // describe('onToggleCollapse', () => {
  //   it('Should toggle the value of the collapsed variable', () => {
  //     component.collapsed = false;
  //     component.onToggleCollapse();
  //     expect(component.collapsed).toBe(true);
  //     component.onToggleCollapse();
  //     expect(component.collapsed).toBe(false);
  //   });
  // });

  // describe('navigateTo', () => {
  //   it('Should navigate to the correct screen', () => {
  //     jest.clearAllMocks();
  //     const spy = jest.spyOn(router, 'navigate');
  //     component.navigateTo('test');
  //     expect(spy).toHaveBeenCalledTimes(1);
  //     expect(spy).toHaveBeenCalledWith(['test']);
  //   });

  //   it('Should collapse the menu if it is open', () => {
  //     component.collapsed = false;
  //     component.navigateTo('test');
  //     expect(component.collapsed).toBe(true);
  //   });
  // });

  // describe('isRouteActive', () => {
  //   describe('When it is called with the same route as the current', () => {
  //     it('Should return true', () => {
  //       expect(component.isRouteActive('')).toBe(true);
  //     });
  //   });

  //   describe('When it is called with a different route as the current', () => {
  //     it('Should return true', () => {
  //       expect(component.isRouteActive('test')).toBe(false);
  //     });
  //   });
  // });

  // describe('When onOutside click is called', () => {
  //   let clickedTarget: any;

  //   describe('When clicking inside the navbar', () => {
  //     it('Should do nothing', () => {
  //       clickedTarget = compiled.children[0];
  //       component.collapsed = true;
  //       component.clickListener({ target: clickedTarget } as PointerEvent);
  //       expect((component.collapsed = true));

  //       component.collapsed = false;
  //       component.clickListener({ target: clickedTarget } as PointerEvent);
  //       expect((component.collapsed = false));
  //     });
  //   });

  //   describe('When clicking outside the navbar', () => {
  //     it('Should close the navbar', () => {
  //       clickedTarget = document.createElement('p');
  //       component.collapsed = true;
  //       component.clickListener({ target: clickedTarget } as PointerEvent);
  //       expect((component.collapsed = true));

  //       component.collapsed = false;
  //       component.clickListener({ target: clickedTarget } as PointerEvent);
  //       expect((component.collapsed = true));
  //     });
  //   });
  // });

  // describe('When getNavClass is called', () => {
  //   it('Should return the correct classes', () => {
  //     component.collapsed = true;
  //     let result = component.getNavClass();
  //     expect(result).toEqual({
  //       deployed: false,
  //     });

  //     component.collapsed = false;
  //     result = component.getNavClass();
  //     expect(result).toEqual({
  //       deployed: true,
  //     });
  //   });
  // });
});
