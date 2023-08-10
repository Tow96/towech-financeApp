// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Tested elements
import { DesktopLayoutComponent } from './layout.component';
// Services
import { DesktopUserService } from '@finance/desktop/shared/data-access-user';
// Mocks
import { DesktopUserServiceMock } from '@finance/desktop/shared/utils-testing';
import { provideStore } from '@ngrx/store';

describe('Desktop Layout', () => {
  let component: DesktopLayoutComponent;
  let fixture: ComponentFixture<DesktopLayoutComponent>;
  let compiled: HTMLElement;

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
    fixture = TestBed.createComponent(DesktopLayoutComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());
});
