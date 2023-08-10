// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
// Tested elements
import { DesktopLayoutComponent } from './layout.component';
// Services
import { Router } from '@angular/router';
import { DesktopUserService } from '@finance/desktop/shared/data-access-user';
// Mocks
import { DesktopUserServiceMock } from '@finance/desktop/shared/utils-testing';
import { provideStore } from '@ngrx/store';

describe('Desktop Layout', () => {
  let component: DesktopLayoutComponent;
  let fixture: ComponentFixture<DesktopLayoutComponent>;
  let compiled: HTMLElement;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [
        {
          provide: DesktopUserService,
          useValue: DesktopUserServiceMock,
        },
        provideStore(),
      ],
    });
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(DesktopLayoutComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  describe('When the router is triggered', () => {
    it('Should cycle the loading spinner', () => {
      const spy = subscribeSpyTo(component.isRouterLoading$);
      router.navigate(['test']);
      expect(spy.getLastValue()).toBeTruthy();
    });
  });
});
