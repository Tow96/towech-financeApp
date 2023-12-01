import { act, renderHook } from '@testing-library/react';
import { NewToast, useAddToast, useDismissToast, useToastStore, useToasts } from '../ToastService';

describe('Toast Store', () => {
  it('Should have an empty array as an initial value', () => {
    const { result: store } = renderHook(() => useToastStore());
    const { result: toasts } = renderHook(() => useToasts());
    expect(store.current.toasts).toEqual([]);
    expect(toasts.current).toEqual([]);
  });
  it('Should add a new element to the front of the array when adding a toast', () => {
    const { result: toasts } = renderHook(() => useToasts());
    const { result: add } = renderHook(() => useAddToast());

    const toast1: NewToast = { message: 'example', type: 'info' };
    const toast2: NewToast = { message: 'example', type: 'warning' };
    act(() => add.current(toast1));
    expect(toasts.current).toEqual([expect.objectContaining(toast1)]);

    act(() => add.current(toast2));
    expect(toasts.current).toEqual([
      expect.objectContaining(toast2),
      expect.objectContaining(toast1),
    ]);
  });
  it('Should remove the given element when using dismiss', () => {
    const { result: store } = renderHook(() => useToastStore());
    const { result: dismiss } = renderHook(() => useDismissToast());
    act(() => (store.current.toasts = []));

    const toast1: NewToast = { message: 'example', type: 'info' };
    const toast2: NewToast = { message: 'example', type: 'warning' };
    const toast3: NewToast = { message: 'example', type: 'error' };
    act(() => store.current.add(toast1));
    act(() => store.current.add(toast2));
    act(() => store.current.add(toast3));
    const ids = store.current.toasts.map(t => t.id);

    act(() => dismiss.current(ids[0]));
    expect(store.current.toasts).toEqual([
      expect.objectContaining(toast2),
      expect.objectContaining(toast1),
    ]);
  });
});
