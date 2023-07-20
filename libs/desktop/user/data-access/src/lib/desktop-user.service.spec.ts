// Libraries
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
// Tested elements
import { DesktopUserService } from './desktop-user.service';
// Mocks
import { provideStore } from '@ngrx/store';
import { adaptReducer } from '@state-adapt/core';

describe('Desktop User Service', () => {
  let service: DesktopUserService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideStore({ adapt: adaptReducer }), DesktopUserService],
    });
    httpController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(DesktopUserService);
  });

  it('Should be defined', () => expect(service).toBeTruthy());
});
