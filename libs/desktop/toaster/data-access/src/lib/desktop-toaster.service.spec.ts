import { TestBed } from '@angular/core/testing';

import { DesktopToasterService } from './desktop-toaster.service';

describe('DesktopToasterService', () => {
  let service: DesktopToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesktopToasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
