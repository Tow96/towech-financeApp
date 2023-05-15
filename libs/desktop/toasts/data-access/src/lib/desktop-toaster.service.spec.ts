// Libraries
import { TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
// Tested elements
import { DesktopToasterService } from './desktop-toaster.service';

let service: DesktopToasterService;

describe('Toaster-Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesktopToasterService);
  });

  describe('When add is called', () => {
    it('Should add the toast to the tray', () => {
      const spy = subscribeSpyTo(service.toastTray);
      service.add('ADD TEST', 200);

      expect(spy.getLastValue()).toEqual([
        { id: expect.any(String), message: 'ADD TEST', duration: 200 },
      ]);
    });
  });

  describe('When dismiss is called', () => {
    it('Should remove only the dismissed value', () => {
      const spy = subscribeSpyTo(service.toastTray);
      service.add('ADD TEST0', 200);
      service.add('ADD TEST1', 200);
      service.add('ADD TEST2', 200);
      service.add('ADD TEST3', 200);
      const input = spy.getLastValue() || [];
      const inputLength = input.length;

      service.dismiss(input[2].id);

      const result = spy.getLastValue();
      expect(result?.length).toBe(inputLength - 1);
      expect(result).toEqual(input.filter(x => x.id !== input[2].id));
    });
  });
});
