// Libraries
import { ComponentFixture, TestBed } from '@angular/core/testing';
// Tested elements
import { DesktopShellComponent } from './shell.component';
import { of } from 'rxjs';
import { DesktopUserService } from '@towech-finance/desktop/user/data-access';
import { provideStore } from '@ngrx/store';
import { adaptReducer } from '@state-adapt/core';

const mockValues = {
  store: {
    state$: of({
      data: null,
      status: 'Initialized',
      token: null,
    }),
  },
};

describe('Desktop Shell Component', () => {
  let component: DesktopShellComponent;
  let fixture: ComponentFixture<DesktopShellComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DesktopUserService, useValue: mockValues },
        provideStore({ adapt: adaptReducer }),
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
