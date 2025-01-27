import { Injectable, Logger } from "@nestjs/common";

import { IHelpMailArgs, MailService } from "./mail.service";
import { serverConfigs } from "../common/config";

const logger: Logger = new Logger("HelperService")

@Injectable()
export class HelperService {
    private readonly webhookUrl: string = serverConfigs.discordWebhook!

    constructor(
        private readonly mailService: MailService,
    ){}

    public sendHelpEmailWithDiscord(args: Omit<IHelpMailArgs, "discord">): void {
        // 관리 이메일에 알림 메일 전송
        this.mailService.sendHelperEmail({
            ...args,
            discord: this.webhookUrl,
        })
        // 디스코드 채널에 알림 전송
        this.sendDiscordNotify(args)
    }

    private async sendDiscordNotify(args: Omit<IHelpMailArgs, "discord">): Promise<void> {
        const payloads = [
            this.packedFox(),
            this.packedHelpDetail(
                args.title,
                args.text,
                args.createdAt,
            ),
            this.packedRequesterDetail(
                args.requesterId,
                args.requesterEmail,
            ),
            this.packedBookeeperLink()
        ]

        await fetch(this.webhookUrl, {
            method: "POST",
            body: JSON.stringify(payloads),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .catch(e => {
            logger.error("디스코드 알림 전송중 오류가 발생했습니다")
            logger.error(`Reason: ${e}`)
        })
    }

    private packedFox(): IDiscordEmbed {
        return {
            author: {
                name: "량",
                url: "https://ktb-book-keeper.netlify.app",
                icon_url: serverConfigs.discordFoxIcon!,
            },
            description: "문의사항이 도착했어요!"
        }
    }

    private packedHelpDetail(
        title: string,
        description: string,
        createdAt: Date,
    ): IDiscordEmbed {
        return {
            title,
            description,
            timestamp: createdAt.toString(),
        }
    }

    private packedRequesterDetail(
        requesterId: string,
        requesterEmail: string,
    ): IDiscordEmbed {
        return {
            description: `요청자 ID: ${requesterId}\n요청자 이메일: ${requesterEmail}`
        }
    }

    private packedBookeeperLink(): IDiscordEmbed {
        return {
            title: "북키퍼로 이동하기",
            url: "https://ktb-book-keeper.netlify.app",
            color: 14177041,
        }
    }
}

import { tags } from "typia"

interface IDiscordEmbed {
    title?: string
    url?: string & tags.Format<"url">
    color?: string | number
    author?: IDiscordAuthor
    description?: string
    fields?: IDiscordFields
    image?: IDiscordImage
    thumbnail?: IDiscordThumbnail
    footer?: IDiscordFooter
    timestamp?: string
}

interface IDiscordAuthor {
    name: string
    url: string & tags.Format<"url">
    icon_url: string & tags.Format<"url">
}

interface IDiscordFields {
    name: string
    value: string
    inline: boolean
}

interface IDiscordImage {
    url: string & tags.Format<"url">
}

interface IDiscordThumbnail {
    url: string & tags.Format<"url">
}

interface IDiscordFooter {
    text: string
    icon_url: string
}