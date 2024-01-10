// Libraries ------------------------------------------------------------------
import { act, renderHook } from '@testing-library/react';
// Tested elements ------------------------------------------------------------
import { useNavStore, useUpdateTitle } from '../NavbarService';

// Tests ----------------------------------------------------------------------
describe('Navbar Store', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('Store Hook', () => {
    it('Should have an empty string as a title', () => {
      const { result: store } = renderHook(() => useNavStore());
      expect(store.current.title).toBe('');
    });
  });

  describe('Selector Hooks', () => {
    it('Should update the value of the title when calling useUpdateTitle', () => {
      const { result: store } = renderHook(() => useNavStore());
      const { result: update } = renderHook(() => useUpdateTitle());

      act(() => update.current('nEW TITLE'));

      expect(store.current.title).toBe('New Title');
    });
  });
});
