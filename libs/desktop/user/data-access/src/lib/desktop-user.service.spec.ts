// Libraries
import { TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
// Tested elements
import { DesktopUserService } from './desktop-user.service';
// Mocks
import { provideStore } from '@ngrx/store';
import { adaptReducer } from '@state-adapt/core';

describe('Desktop User Service', () => {
  let service: DesktopUserService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DesktopUserService, provideStore({ adapt: adaptReducer })],
    });
    service = TestBed.inject(DesktopUserService);
  });

  it('Should be defined', () => expect(service).toBeTruthy());

  //TEST GOES HERE
});
