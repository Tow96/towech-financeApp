// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { adaptReducer } from '@state-adapt/core';
// Tested elements
import { DesktopShellComponent } from './shell.component';
// Services
import { DesktopUserService } from '@finance/desktop/shared/data-access-user';
import { DesktopUserServiceMock } from '@finance/desktop/shared/utils-testing';

describe('Desktop Shell Component', () => {
  let component: DesktopShellComponent;
  let fixture: ComponentFixture<DesktopShellComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideStore({ adapt: adaptReducer }),
        { provide: DesktopUserService, useValue: DesktopUserServiceMock },
      ],
    });
    fixture = TestBed.createComponent(DesktopShellComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('Should be defined', () => expect(component).toBeTruthy());

  it('Must match the snapshot', () => expect(compiled).toMatchSnapshot());
});
