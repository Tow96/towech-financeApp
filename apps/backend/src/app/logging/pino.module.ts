import { LoggerModule } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { DynamicModule } from '@nestjs/common';

import { PrettyTransport } from './transports/pretty.transport';
import { CORRELATION_ID_HEADER } from './middleware/correlation-id.middleware';
import { DefaultSerializer } from './serializers/default.serializer';

export const PinoModule: DynamicModule = LoggerModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const env = configService.getOrThrow<string>('NODE_ENV');
    const logLevel: string = configService.get<string>('LOG_LEVEL') ?? 'info';

    return {
      pinoHttp: {
        transport: env === 'development' ? PrettyTransport : undefined,
        level: logLevel,
        autoLogging: false,
        messageKey: 'message',
        serializers: DefaultSerializer,

        customProps: req => ({
          correlationId: req.headers[CORRELATION_ID_HEADER],
        }),
      },
    };
  },
});
