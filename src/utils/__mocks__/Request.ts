import { instance, mock, when } from 'ts-mockito';

type Data = {
  headers?: Record<string, string>;
  body?: Record<string, any>;
};

export const mockRequest = (data?: Data) => {
  const mockedRequest: Request = mock(Request);
  when(mockedRequest.headers).thenReturn({
    get: (s: string) => (data?.headers || {})[s] || null,
  } as any);
  when(mockedRequest.json).thenReturn(async () => data?.body || null);

  return instance(mockedRequest);
};
