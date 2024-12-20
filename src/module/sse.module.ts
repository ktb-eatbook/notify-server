import { Module } from "@nestjs/common";
import { SSEController } from "src/controller/sse.controller";
import { SSESerivce } from "src/service/sse.sevice";

@Module({
    providers: [SSESerivce],
    controllers: [SSEController],
})
export class SSEModule {}