/** mongo.module.ts
 * Copyright (c) 2023, Towechlabs
 *
 * Module that handles the connection to MongoDB
 */
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
    }),
  ],
})
export class AuthenticationMongoModule {}
