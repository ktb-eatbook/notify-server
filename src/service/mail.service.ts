import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import * as fs from "fs"
import * as path from "path"

import { serverConfigs } from "../common/config";

const logger: Logger = new Logger("MailService")
const templetePath = path.join(__dirname, "../../../public/templete/")

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter
  private readonly alertTemplete: string
  private readonly reminderTemplete: string
  private readonly helpTemplete: string

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
      this.helpTemplete = fs.readFileSync(templetePath + "help_templete.html", 'utf-8')
    }

    public async sendAlertEmail(args: IAlertMailArgs): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: serverConfigs.authEmail, 
                subject: "새로운 소설 등록 요청이 도착했습니다",
                to: serverConfigs.authEmail,
                html: this.getAlertTemplete(args)
            })
            logger.log('알림 메일이 전송되었습니다')
        } catch (e) {
            logger.error('메일 전송 중 오류가 발생했습니다:', e)
        }
    }

    public async sendReminderEmail(args: IStatusMailArgs): Promise<void> {
        try {
            await Promise.all(
                args.toEmails.map(to => 
                    this.transporter.sendMail({
                        from: serverConfigs.authEmail, 
                        subject: "소설 등록 요청 결과 리마인드 메일입니다",
                        to,
                        html: this.getRemindertTemplete({
                            reason: args.reason,
                            responsiblePerson: args.reason,
                            responsiblePersonEmail: args.responsiblePersonEmail,
                            status: args.status,
                            createdAt: args.createdAt,
                        })
                    })
                )
            )
            logger.log('리마인더 메일이 전송되었습니다')
        } catch (e) {
            logger.error('메일 전송 중 오류가 발생했습니다:', e)
        }
    }

    public async sendHelperEmail(args: IHelpMailArgs) {
        try {
            await this.transporter.sendMail({
                from: serverConfigs.authEmail,
                subject: "새로운 문의사항이 도착했습니다",
                to: serverConfigs.authEmail,
                html: this.getHelpTemplete(args),
            })

            logger.log('문의 메일이 전송되었습니다')
        } catch(e) {
            logger.error('메일 전송 중 오류가 발생했습니다:', e)
        }
    }

    private getAlertTemplete(args: IAlertMailArgs): string {
        return this.replaceTempleteArguments(
            this.alertTemplete,
            args,
        )
    }

    private getRemindertTemplete(args: Omit<IStatusMailArgs, "toEmails">): string {
        args['color'] = this.getColorFromStatus(args.status)
        return this.replaceTempleteArguments(
            this.reminderTemplete,
            args,
        )
    }

    private getHelpTemplete(args: IHelpMailArgs): string {
        return this.replaceTempleteArguments(
            this.helpTemplete,
            args,
        )
    }

    private getColorFromStatus(status: NovelStatus) {
        switch(status) {
        case "pending":
        case "reviewed":
            return "#F9CAA6"
        case "confirm":
            return "#1CBA3E"
        case "cancel":
            return "#FD6830"
        }
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

export interface IAlertMailArgs extends MailArgs {
  requester: string
  requesterEmail: string
  title: string
  description: string
  ref: string
  createdAt: Date
}

export interface IStatusMailArgs extends MailArgs {
  responsiblePerson: string
  responsiblePersonEmail: string
  toEmails: Array<string>
  status: NovelStatus
  reason: string
  createdAt: Date
}

export interface IHelpMailArgs extends MailArgs {
    title: string
    text: string
    requester: string
    requesterId: string
    requesterEmail: string
    discord?: string
    createdAt: Date
}

export type NovelStatus = "pending" | "reviewed" | "confirm" | "cancel"
