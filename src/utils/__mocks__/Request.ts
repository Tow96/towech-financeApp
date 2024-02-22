import { instance, mock, when } from 'ts-mockito';

export const mockRequest = () => {
  const mockedRequest: Request = mock(Request);
  when(mockedRequest.headers).thenReturn({ get: () => null } as any);

  return instance(mockedRequest);
};
