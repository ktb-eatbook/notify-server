import { Module } from "@nestjs/common";

import { HelperController } from "../controller/helper.controller";
import { HelperService } from "../service/helper.service";
import { MailService } from "../service/mail.service";

@Module({
    providers: [
        HelperService,
        MailService,
    ],
    controllers: [HelperController,],
})
export class HelperModule {}