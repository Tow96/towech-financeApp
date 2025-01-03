import { TransportSingleOptions } from 'pino';

export const PrettyTransport: TransportSingleOptions = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    messageKey: 'message',
    ignore: 'correlationId',
  },
};
