// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
// Tested elements
import { DesktopLayoutComponent } from './layout.component';
// Services
import { DesktopUserService } from '@finance/desktop/shared/data-access-user';
// Mocks
import { DesktopUserServiceMock } from '@finance/desktop/shared/utils-testing';
import { AsyncPipe, NgIf } from '@angular/common';

describe('Desktop Layout', () => {
  let component: DesktopLayoutComponent;
  let fixture: ComponentFixture<DesktopLayoutComponent>;
  let compiled: HTMLElement;

  const getElement = (testid: string) =>
    fixture.debugElement.query(By.css(`[data-test-id="${testid}"]`));

  function initTest() {
    TestBed.resetTestingModule();
    TestBed.overrideComponent(DesktopLayoutComponent, {
      set: {
        host: { '(click)': 'dummy' },
        imports: [AsyncPipe, NgIf],
        providers: [],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      },
    });
  }

  beforeEach(() => {
    initTest();
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [
        { provide: DesktopUserService, useValue: DesktopUserServiceMock },
        // { provide: Router, useClass: mockRouterSuccess },
      ],
    });
    fixture = TestBed.createComponent(DesktopLayoutComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  describe('Navigation Spinner', () => {
    it('Should be hidden on start', () => expect(getElement('nav-spinner')).toBeFalsy());

    // describe('Immediate start and end', () => {
    //   let spy: SubscriberSpy<unknown>;
    //   beforeEach(() => {
    //     initTest();
    //     TestBed.configureTestingModule({
    //       imports: [BrowserAnimationsModule],
    //       providers: [
    //         { provide: DesktopUserService, useValue: DesktopUserServiceMock },
    //         { provide: Router, useClass: mockRouterSuccessImmediate },
    //       ],
    //     });

    //     spy = subscribeSpyTo(component.isRouterLoading$);
    //   });

    //   it('Should not trigger', () => {
    //     console.log(spy.getValues());
    //   });
    // });

    // describe('Immediate start and end', () => {
    //   let spy: SubscriberSpy<unknown>;
    //   beforeEach(() => {
    //     initTest();
    //     TestBed.configureTestingModule({
    //       imports: [BrowserAnimationsModule],
    //       providers: [
    //         { provide: DesktopUserService, useValue: DesktopUserServiceMock },
    //         { provide: Router, useClass: mockRouterSuccess },
    //       ],
    //     });

    //     spy = subscribeSpyTo(component.isRouterLoading$);
    //   });

    //   it('Should not trigger', () => {
    //     console.log(spy.getValues());
    //   });
    // });
  });
});
