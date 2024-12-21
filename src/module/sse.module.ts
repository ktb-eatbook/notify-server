import { Module } from "@nestjs/common";

import { SSEController } from "../controller/sse.controller";
import { SSESerivce } from "../service/sse.sevice";

@Module({
    providers: [SSESerivce],
    controllers: [SSEController],
    exports: [SSESerivce]
})
export class SSEModule {}