import { Controller, Res } from "@nestjs/common";
import { TypedBody, TypedRoute } from "@nestia/core";
import { Response } from "express";

import { HelperService } from "../service/helper.service";
import { ERROR } from "../common";

@Controller("helper")
export class HelperController {
    constructor(
        private readonly helperService: HelperService,
    ){}

    @TypedRoute.Post()
    public sendHelp(
        @TypedBody() body: Body.ISendHelpArgs,
        @Res() response: Response,
    ) {
        try {
            this.helperService.sendHelpEmailWithDiscord({
                text: body.text,
                title: body.title,
                requesterEmail: body.requesterEmail,
                requesterId: body.requesterId,
                createdAt: new Date(body.createdAt),
            })
            
            response.json(true)
        } catch(e) {
            response.json(ERROR.BadRequest)
        }
    }
}

import { tags } from "typia"

export namespace Body {
    export interface ISendHelpArgs {
        requesterId: string & tags.MaxLength<38>
        requesterEmail: string & tags.Format<"email">
        title: string & tags.MaxLength<200>
        text: string
        createdAt: string | Date
    }
}