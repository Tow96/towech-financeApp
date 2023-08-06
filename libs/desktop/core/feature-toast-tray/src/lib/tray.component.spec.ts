// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Tested Elements
import { DesktopToastTrayComponent } from './tray.component';
// Mocks
import { DesktopToasterServiceMock } from '@finance/desktop/shared/utils-testing';

describe('Desktop Toaster', () => {
  let component: DesktopToastTrayComponent;
  let fixture: ComponentFixture<DesktopToastTrayComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [DesktopToasterServiceMock],
    });

    fixture = TestBed.createComponent(DesktopToastTrayComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should exist', () => expect(component).toBeTruthy());

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());
});
