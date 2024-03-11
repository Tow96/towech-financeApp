import { instance, mock, when } from 'ts-mockito';

type Data = {
  headers?: Record<string, string>;
  body?: Record<string, any>;
};

export const mockRequest = (data?: Data) => {
  const mockedRequest: Request = mock(Request);
  const headers: Record<string, any> = { Origin: 'pesto', Host: 'pesto', ...data?.headers };
  when(mockedRequest.headers).thenReturn({
    get: (s: string) => headers[s] || null,
    set: (key: string, value: string) => {
      headers[key] = value;
    },
  } as any);
  when(mockedRequest.json).thenReturn(async () => data?.body || null);
  when(mockedRequest.url).thenReturn('http://localhost');

  return instance(mockedRequest);
};
