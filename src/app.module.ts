import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis'

import { SSEModule } from './module/sse.module';
import { BrokerModule } from './module/broker.module';
import { SSESerivce } from './service/sse.sevice';

@Module({
  imports: [
    SSEModule,
    BrokerModule,
    CacheModule.register({
      store: redisStore,
      host: "localhost",
      port: 6379, // 고정임
      isGlobal: true, // 전역적으로 쓸꺼임?
    })
  ]
})
export class AppModule {}
