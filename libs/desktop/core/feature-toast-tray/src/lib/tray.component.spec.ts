// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Tested Elements
import { DesktopSharedFeatureToastTrayComponent } from './tray.component';
// Mocks
import { DesktopSharedDataAccessToasterServiceMock } from '@finance/desktop/shared/utils-testing';

describe('Desktop Toaster', () => {
  let component: DesktopSharedFeatureToastTrayComponent;
  let fixture: ComponentFixture<DesktopSharedFeatureToastTrayComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [DesktopSharedDataAccessToasterServiceMock],
    });

    fixture = TestBed.createComponent(DesktopSharedFeatureToastTrayComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should exist', () => expect(component).toBeTruthy());

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());
});
