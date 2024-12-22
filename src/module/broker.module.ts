import { Module } from "@nestjs/common";

import { BrokerController } from "../controller/broker.controller";
import { BrokerService } from "../service/broker.service";
import { SSEModule } from "./sse.module";

@Module({
    imports: [SSEModule],
    controllers: [BrokerController],
    providers: [
        BrokerService,
    ]
})
export class BrokerModule {}