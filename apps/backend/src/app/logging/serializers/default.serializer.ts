import { SerializerFn } from 'pino';

export const DefaultSerializer: { [p: string]: SerializerFn } = {
  req: () => undefined, // Remove the req for security reasons
  res: () => undefined, // Remove the res as it is unused
};
