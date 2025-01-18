import { Module } from "@nestjs/common";
import { MailController } from "src/controller/mail.controller";
import { MailService } from "src/service/mail.service";

@Module({
    providers: [MailService,],
    controllers: [MailController],
    exports: [MailService],
})
export class MailModule {}