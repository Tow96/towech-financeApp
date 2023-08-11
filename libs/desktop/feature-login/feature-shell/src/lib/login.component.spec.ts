// // Libraries
// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
// // Services
// import { DesktopUserService } from '@finance/desktop/shared/data-access-user';
// import { DesktopToasterService } from '@finance/desktop/shared/data-access-toast';
// // Tested elements
// import { DesktopLoginComponent } from './login.component';
// // Mocks
// import {
//   fakeUserServiceFire,
//   DesktopToasterServiceMock,
//   DesktopUserServiceMock,
// } from '@finance/desktop/shared/utils-testing';
// import { provideStore } from '@ngrx/store';
// import { Action, adaptReducer } from '@state-adapt/core';
// import { PatchFormGroupValuesDirective } from '@finance/desktop/shared/data-access-form';

// Component ------------------------------------------------------------------
it.todo('Desktop Login Component');
// describe('Desktop Login Component', () => {
//   let component: DesktopLoginComponent;
//   let fixture: ComponentFixture<DesktopLoginComponent>;
//   let userService: DesktopUserService;
//   let toastService: DesktopToasterService;
//   let compiled: HTMLElement;
//   let stateSpy: SubscriberSpy<any>;

//   const updateComponent = () => {
//     fixture.detectChanges();
//     component = fixture.componentInstance;
//     compiled = fixture.nativeElement;
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//     TestBed.configureTestingModule({
//       providers: [
//         provideStore({ adapt: adaptReducer }),
//         { provide: DesktopToasterService, useValue: DesktopToasterServiceMock },
//         { provide: DesktopUserService, useValue: DesktopUserServiceMock },
//         PatchFormGroupValuesDirective,
//       ],
//     });
//     fixture = TestBed.createComponent(DesktopLoginComponent);

//     component = fixture.componentInstance;
//     fixture.detectChanges();
//     compiled = fixture.nativeElement;

//     userService = TestBed.inject<DesktopUserService>(DesktopUserService);
//     toastService = TestBed.inject<DesktopToasterService>(DesktopToasterService);
//     stateSpy = subscribeSpyTo(component.formState.store.state$);
//   });

//   it('Should be defined', () => expect(component).toBeTruthy());

//   it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());

//   describe('When the form fields are changed', () => {
//     it('Should update the store after the debounce time has passed', fakeAsync(() => {
//       const newState = {
//         keepSession: false,
//         password: 'pass',
//         username: 'user',
//       };

//       component.formState.form.patchValue(newState);
//       tick(1000);
//       expect(stateSpy.getLastValue()).toEqual(newState);
//     }));
//   });

//   describe('When the login button is pressed', () => {
//     let userSpy: SubscriberSpy<Action<any, string>>;
//     let toastSpy: SubscriberSpy<Action<any, string>>;
//     let loginBttn: HTMLElement;

//     beforeEach(() => {
//       userSpy = subscribeSpyTo(userService.login$);
//       toastSpy = subscribeSpyTo(toastService.addError$);
//       loginBttn = fixture.debugElement.nativeElement.querySelector('#Login-button > button');
//     });

//     describe('With an invalid form', () => {
//       beforeEach(() => {
//         component.formState.form.patchValue({ username: '', keepSession: false, password: '' });
//         loginBttn.click();
//       });

//       it('Should not call the user service', () => expect(userSpy.receivedNext()).toBeFalsy());

//       it('Should send an error toast', () => expect(toastSpy.receivedNext()).toBeTruthy());
//     });

//     describe('With a valid form', () => {
//       it('Should next the userservice', () => {
//         component.formState.form.patchValue({
//           username: 'user',
//           keepSession: false,
//           password: 'pass',
//         });
//         loginBttn.click();
//         expect(userSpy.receivedNext()).toBe(true);
//       });
//     });
//   });

//   describe('When the userService nexts the onLoginError$ pipe', () => {
//     beforeEach(() =>
//       fakeUserServiceFire.next({ payload: '', type: '[User Service] Login.error$' })
//     );

//     it('Should clear the form', () => expect(stateSpy.getLastValue()).toBe(component.initialState));

//     it('Should set the form components to dirty', () => {
//       updateComponent();
//       expect(fixture.debugElement.query(By.css('#form-username')).classes['ng-dirty']).toBeTruthy();
//       expect(fixture.debugElement.query(By.css('#form-password')).classes['ng-dirty']).toBeTruthy();
//       expect(fixture.debugElement.query(By.css('#form-keep')).classes['ng-dirty']).toBeTruthy();
//     });
//   });
// });
