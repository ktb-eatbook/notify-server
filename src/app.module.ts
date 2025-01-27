import { Module } from '@nestjs/common';

import { SSEModule } from './module/sse.module';
import { BrokerModule } from './module/broker.module';
import { MailModule } from './module/mail.module';
import { HelperModule } from './module/helper.module';

@Module({
  imports: [
    SSEModule,
    BrokerModule,
    MailModule,
    HelperModule,
  ]
})
export class AppModule {}
