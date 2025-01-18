import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import * as fs from "fs"
import * as path from "path"
import { assert } from "typia"

import { serverConfigs } from "../common/config";

const templetePath = path.join(__dirname, "../../../public/templete/")

@Injectable()
export class MailService {
    private readonly transporter: nodemailer.Transporter
    private readonly alertTemplete: string
    private readonly reminderTemplete: string
  
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: serverConfigs.host,
            port: 587,
            secure: false,
            auth: {
              user: serverConfigs.authUser,
              pass: serverConfigs.authEmailPass,
            }
        })
        this.alertTemplete = fs.readFileSync(templetePath + "alert_templete.html", 'utf8')
        this.reminderTemplete = fs.readFileSync(templetePath + "reminder_templete.html", 'utf-8')
    }

    public async sendAlertEmail(args: AlertMailArgs): Promise<void> {
        try {
          await this.transporter.sendMail({
            from: serverConfigs.authEmail, 
            subject: "새로운 소설 등록 요청이 도착했습니다",
            to: serverConfigs.authEmail,
            html: this.getAlertTemplete(args)
          })
          console.log('메일이 전송되었습니다')
        } catch (error) {
          console.error('메일 전송 중 오류가 발생했습니다: ', error)
        }
    }

    public async sendReminderEmail(args: {
        novel: IReminderNovel,
        snapshots: StatusMailArgs[],
        createdAt: Date
    }): Promise<number> {
        this.validateStatus(args.snapshots)

        const result = await Promise.all(
            args.snapshots.map(
                (snapshot) => {
                    return this.transporter.sendMail({
                        from: serverConfigs.authEmail, 
                        subject: "소설 등록 요청 결과 리마인드 메일입니다",
                        to: snapshot.responsiblePersonEmail,
                        html: this.getRemindertTemplete(
                            args.novel,
                            {
                                ...snapshot,
                                createdAt: args.createdAt,
                            },
                        )
                    })
                    .then(_=> true)
                    .catch(e => {
                        console.error('메일 전송 중 오류가 발생했습니다')
                        console.error(`Reason: ${e}`)
                        return false
                    })
                }
            )
        )

        return result.reduce((prev, curr) => curr ? prev + 1 : prev, 0)
    }

    private getAlertTemplete(args: AlertMailArgs): string {
        return this.replaceTempleteArguments(
            this.alertTemplete,
            args,
        )
    }

    private validateStatus(snapshots: StatusMailArgs[]) {
        for(let i=0; i<snapshots.length; ++i) {
            const snapshot = snapshots[i]
            assert<NovelStatus>(snapshot.status)
        }
    }

    private getRemindertTemplete(
        novel: IReminderNovel,
        args: StatusMailArgs & { createdAt: Date },
    ): string {
        args = { ...args, ...novel }
        args['color'] = args.status === "confirm" ? "#1CBA3E" : args.status === "cancel" ? "#FD6830" : "#F9CAA6"

        return this.replaceTempleteArguments(
            this.reminderTemplete,
            args,
        )
    }

    private replaceTempleteArguments(
        templete: string,
        args: MailArgs
    ): string {
        const keys = Object.keys(args)
        for(let i=0; i<keys.length; ++i) {
            templete = templete.replaceAll(`{${keys[i]}}`, `${args[keys[i]]}`)
        }
        return templete
    }
}

export interface MailArgs {}
export type NovelStatus = "pending" | "reviewed" | "confirm" | "cancel"

export interface AlertMailArgs extends MailArgs {
    requester: string
    requesterEmail: string
    title: string
    description: string
    ref: string
    createdAt: Date
}

export interface StatusMailArgs extends MailArgs {
    responsiblePerson: string
    responsiblePersonEmail: string
    status: NovelStatus
    reason: string
}

interface IReminderNovel {
    title: string
    description: string
    ref: string
    novelCreatedAt: Date
}