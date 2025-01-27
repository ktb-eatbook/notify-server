import { Controller, Res } from "@nestjs/common";
import { TypedBody, TypedRoute } from "@nestia/core";
import { Response } from "express";
import { tags } from "typia"

import { 
    MailService, 
    NovelStatus 
} from "../service/mail.service";

@Controller("mail")
export class MailController {
    constructor(
        private readonly mailService: MailService,
    ){}

    @TypedRoute.Post("alert")
    public async sendAlert(
        @TypedBody() body: Body.IAlertMailArgs,
        @Res() response: Response
    ) {
        try {
            await this.mailService.sendAlertEmail({
                requester: body.requester,
                requesterEmail: body.requesterEmail,
                ref: body.ref,
                title: body.title,
                description: body.description,
                createdAt: new Date(body.createdAt),
            })
            response.json({
                status: 201,
                message: "메일을 성공적으로 전송했습니다"
            })
        } catch(e) {
            let reason = e.message

            response.json({
                status: 400,
                reason: reason ? reason : "잘못된 요청 형식입니다",
            })
        }
    }

    @TypedRoute.Post("reminder")
    public async sendReminder(
        @TypedBody() body: Body.IStatusMailArgs,
        @Res() response: Response
    ) {
        try {
            const result = await this.mailService.sendReminderEmail({
                reason: body.reason,
                responsiblePerson: body.responsiblePerson,
                responsiblePersonEmail: body.responsiblePersonEmail,
                toEmails: body.toEmails,
                status: body.status,
                createdAt: new Date(body.createdAt),
            })
            response.json({
                status: 201,
                message: `${result}개의 리마인더 메일을 성공적으로 전송했습니다`
            })
        } catch(e) {
            let reason = e.message

            response.json({
                status: 400,
                reason: reason ? reason : "잘못된 요청 형식입니다",
            })
        }
    }
}

export namespace Body {
    export interface IAlertMailArgs {
        requester: string
        requesterEmail: string & tags.Format<"email">
        title: string & tags.MaxLength<200>
        description: string & tags.MaxLength<200>
        ref: string & tags.Format<"url">
        createdAt: string | Date
    }

    export interface IStatusMailArgs {
        responsiblePerson: string
        responsiblePersonEmail: string & tags.Format<"email">
        toEmails: Array<string & tags.Format<"email">>
        status: NovelStatus
        reason: string & tags.MaxLength<300>
        createdAt: string | Date
    }
}