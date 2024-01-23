import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const mockGet = jest.fn();
export const mockPostCred = jest.fn();
export const mockPost = jest.fn();
export const mockPatch = jest.fn();
export const mockPut = jest.fn();
jest.mock('../HttpCommon', () => ({
  apiClient: jest.fn().mockImplementation(() => ({
    get: (u: string, t?: string) => mockGet(u, t),
    postWithCredentials: (u: string, p?: unknown) => mockPostCred(u, p),
    patch: (u: string, t?: string, p?: unknown) => mockPatch(u, t, p),
    put: (u: string, t?: string, p?: unknown) => mockPut(u, t, p),
    post: (u: string, t?: string, p?: unknown) => mockPost(u, t, p),
  })),
}));

export const mockTanstack = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper, queryClient };
};
