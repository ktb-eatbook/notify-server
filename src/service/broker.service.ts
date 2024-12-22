import { Injectable } from "@nestjs/common";

import { SSESerivce } from "./sse.sevice";

@Injectable()
export class BrokerService {
    constructor(
        private readonly sseService: SSESerivce,
    ){}
    
    broadcast(
        title: string,
        message: string,
    ) {
        this.sseService.broadcast({
            title,
            message,
        })
    }

    toUser({
        title,
        message,
        to_user_id,
        to_email,
    }: {
        title: string
        message: string
        to_user_id: string
        to_email: string
    }) {
        this.sseService.toUser({
            title,
            message,
            to_email,
            to_user_id,
        })
    }

    novel({
        title,
        message,
        novel_id,
        novel_title,
        summary,
    }: {
        title: string
        message: string
        novel_id: string
        novel_title: string
        summary: string
    }) {
        this.sseService.novel({
            title,
            message,
            novel_id,
            novel_title,
            summary
        })
    }
}