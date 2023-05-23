// Libraries
import { TestBed } from '@angular/core/testing';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
import { StoreModule, Store } from '@ngrx/store';
// Tested elements
import { LoginStore } from './login.store';
// Mocks
import { DesktopToasterService } from '@towech-finance/desktop/toasts/data-access';

describe('Login Store', () => {
  let service: LoginStore;
  let toasts: DesktopToasterService;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [LoginStore],
    });
    service = TestBed.inject(LoginStore);
    toasts = TestBed.inject(DesktopToasterService);
    store = TestBed.get(Store);
  });

  it('Should be defined', () => expect(service).toBeTruthy());

  describe('When handleFormAction is called', () => {
    let formSpy: SubscriberSpy<any>;

    beforeEach(() => {
      service.handleFormAction({
        controlId: 'loginForm.username',
        type: 'ngrx/forms/SET_VALUE',
        value: 'test',
      });
      formSpy = subscribeSpyTo(service.form$);
    });

    it('Should append the data', () => {
      const result = formSpy.getFirstValue();

      expect(result.controls).toEqual({
        username: expect.objectContaining({ value: 'test' }),
        password: expect.objectContaining({ value: '' }),
        keepSession: expect.objectContaining({ value: false }),
      });
    });

    describe('With invalid or insufficient data', () => {
      it('Should mark the form as invalid', () => {
        service.handleFormAction({
          controlId: 'loginForm.password',
          type: 'ngrx/forms/SET_VALUE',
          value: '',
        });
        const result = formSpy.getLastValue();

        expect(result.isValid).toBe(false);
        expect(result.isInvalid).toBe(true);
        expect(result.errors).not.toEqual({});
      });
    });

    describe('With valid data', () => {
      it('Should mark the form as invalid', () => {
        service.handleFormAction({
          controlId: 'loginForm.password',
          type: 'ngrx/forms/SET_VALUE',
          value: 'pass',
        });
        const result = formSpy.getLastValue();

        expect(result.isValid).toBe(true);
        expect(result.isInvalid).toBe(false);
        expect(result.errors).toEqual({});
      });
    });
  });

  describe('When login is called', () => {
    let toastSpy: any;
    let storeSpy: any;

    beforeEach(() => {
      jest.clearAllMocks();
      service.handleFormAction({
        controlId: 'loginForm.username',
        type: 'ngrx/forms/SET_VALUE',
        value: 'test',
      });
      service.handleFormAction({
        controlId: 'loginForm.password',
        type: 'ngrx/forms/SET_VALUE',
        value: 'pass',
      });

      toastSpy = jest.spyOn(toasts, 'add');
      storeSpy = jest.spyOn(store, 'dispatch');
    });

    describe('With an invalid form', () => {
      it('Should call the toast service with a warning', () => {
        service.handleFormAction({
          controlId: 'loginForm.password',
          type: 'ngrx/forms/SET_VALUE',
          value: '',
        });

        service.login();

        expect(toastSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('With an untouched form', () => {
      it('Should call the toast service with a warning', () => {
        service.handleFormAction({
          controlId: 'loginForm.password',
          type: 'ngrx/forms/SET_VALUE',
          value: 'pass',
        });

        service.login();

        expect(toastSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('With a valid form', () => {
      it('Should dispatch a login global action', () => {
        service.handleFormAction({
          controlId: 'loginForm.password',
          type: 'ngrx/forms/SET_VALUE',
          value: 'pass',
        });
        service.handleFormAction({
          controlId: 'loginForm.password',
          type: 'ngrx/forms/MARK_AS_DIRTY',
        });

        service.login();

        expect(storeSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
