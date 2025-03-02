import { LoggerModule } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

import { PrettyTransport } from './Transports/Pretty.Transport';
import { CORRELATION_ID_HEADER } from './Middleware/CorrelationId.Middleware';
import { DefaultSerializer } from './Serializers/Default.Serializer';
import { DynamicModule } from '@nestjs/common';

export const PinoModule: DynamicModule = LoggerModule.forRootAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const env = configService.getOrThrow<string>('NODE_ENV');
    const logLevel: string = configService.get<string>('LOG_LEVEL') ?? 'info';

    return {
      pinoHttp: {
        transport: env === 'development' ? PrettyTransport : undefined,
        level: logLevel,
        autoLogging: false,
        messageKey: 'message',
        serializers: DefaultSerializer,

        customProps: (req) => ({
          correlationId: req.headers[CORRELATION_ID_HEADER],
        }),
      },
    };
  },
});
