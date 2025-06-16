import { TransportSingleOptions } from 'pino';

export const PrettyTransport: TransportSingleOptions = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    messageKey: 'message',
    ignore: 'pid,hostname,correlationId,context',
    messageFormat: '[{context}] {message}',
  },
};
