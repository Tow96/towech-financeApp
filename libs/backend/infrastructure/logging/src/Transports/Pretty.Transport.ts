import { TransportSingleOptions } from 'pino';

export const PrettyTransport: TransportSingleOptions = {
  target: 'pino-pretty',
  options: { messageKey: 'message' },
};
