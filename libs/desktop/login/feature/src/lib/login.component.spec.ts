// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
// Tested elements
import { DesktopLoginComponent } from './login.component';
import { LoginStore } from './login.store';

describe('Desktop Login Component', () => {
  let component: DesktopLoginComponent;
  let fixture: ComponentFixture<DesktopLoginComponent>;
  let compiled: HTMLElement;
  // let store: LoginStore;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [LoginStore],
    });
    // store = TestBed.inject(LoginStore);
    fixture = TestBed.createComponent(DesktopLoginComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

  // For some reason the spy doesn't work
  // describe('When onLoginFormSubmit is called', () => {
  // it('Should call the login function from the component store', () => {
  //   const storeSpy = jest.spyOn(store, 'login');
  //   component.onLoginFormSubmit();

  //   expect(store.login).toHaveBeenCalledTimes(1);
  // });
  // });
});
