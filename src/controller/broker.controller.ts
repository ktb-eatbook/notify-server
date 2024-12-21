import { Controller } from "@nestjs/common";
import { TypedBody, TypedRoute } from "@nestia/core";

import { BrokerService } from "../service/broker.service";
import { ERROR, TryCatch } from "../common";

@Controller('broker')
export class BrokerController {
    constructor(
        private readonly brokerService: BrokerService,
    ){}

    @TypedRoute.Post('broadcast')
    broadcast(
        @TypedBody() body: Body.IBroadcast
    ): TryCatch<
    boolean,
    | typeof ERROR.BadRequest
    | typeof ERROR.Forbidden
    | typeof ERROR.TooManyRequests
    > {
        try {
            this.brokerService.broadcast(body.title, body.message)
            return {
                data: true,
                status: 201,
            }
        } catch(e) {
            return e
        }
    }

    @TypedRoute.Post('touser')
    toUser(
        @TypedBody() body: Body.IToUser
    ): TryCatch<
    boolean,
    | typeof ERROR.BadRequest
    | typeof ERROR.Forbidden
    | typeof ERROR.TooManyRequests
    > {
        try {
            this.brokerService.toUser({
                title: body.title, 
                message: body.message,
                to_user_id: body.to_user_id,
                to_email: body.to_email,
            })
            return {
                data: true,
                status: 201,
            }
        } catch(e) {
            return e
        }
    }

    @TypedRoute.Post('novel')
    novel(
        @TypedBody() body: Body.INovel
    ): TryCatch<
    boolean,
    | typeof ERROR.BadRequest
    | typeof ERROR.Forbidden
    | typeof ERROR.TooManyRequests
    > {
        try {
            this.brokerService.novel({
                title: body.title, 
                message: body.message,
                novel_id: body.novel_id,
                novel_title: body.novel_title,
                summary: body.summary,
            })
            return {
                data: true,
                status: 201,
            }
        } catch(e) {
            return e
        }
    }
}

import { tags } from "typia"

export namespace Body {
    export interface IBroadcast {
        readonly message: string
        readonly title: string
    }

    export interface IToUser extends IBroadcast {
        readonly to_user_id: string & tags.MaxLength<36>
        readonly to_email: string & tags.Format<"email"> & tags.MaxLength<255>
    }

    export interface INovel extends IBroadcast {
        readonly novel_id: string & tags.MaxLength<36>
        readonly novel_title: string
        readonly summary: string
    }

    export interface IEvent extends IBroadcast {

    }
}