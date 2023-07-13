// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Tested Elements
import { DesktopToasterComponent } from './desktop-toast.component';
// Services
import { DesktopToasterService } from '@towech-finance/desktop/toasts/data-access';
import { of } from 'rxjs';
// Models
import { ToastTypes } from '@towech-finance/desktop/toasts/utils';

const mockValues = {
  toasts: {
    state$: of([
      {
        id: '-3',
        message: 'ADD TEST 3',
        type: ToastTypes.WARNING,
      },
      {
        id: '-2',
        message: 'ADD TEST 2',
        type: ToastTypes.SUCCESS,
      },
      {
        id: '-1',
        message: 'ADD TEST 1',
        type: ToastTypes.ERROR,
      },
      {
        id: '-0',
        message: 'ADD TEST 0',
        type: ToastTypes.ACCENT,
      },
    ]),
  },
};

describe('Desktop Toaster', () => {
  let component: DesktopToasterComponent;
  let fixture: ComponentFixture<DesktopToasterComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [{ provide: DesktopToasterService, useValue: mockValues }],
    });

    fixture = TestBed.createComponent(DesktopToasterComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should exist', () => expect(component).toBeTruthy());

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());
});
