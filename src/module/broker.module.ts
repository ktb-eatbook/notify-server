import { Module } from "@nestjs/common";

import { BrokerController } from "../controller/broker.controller";
import { SSESerivce } from "../service/sse.sevice";
import { BrokerService } from "../service/broker.service";

@Module({
    imports: [],
    controllers: [BrokerController],
    providers: [
        BrokerService,
        SSESerivce,
    ]
})
export class BrokerModule {}