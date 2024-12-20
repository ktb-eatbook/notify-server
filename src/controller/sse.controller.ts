import { 
    Controller, 
    Res, 
    Req, 
    Sse,
} from "@nestjs/common";
import { TypedQuery } from "@nestia/core";
import { Request, Response } from "express";

import { SSESerivce } from "../service/sse.sevice";

@Controller('sse')
export class SSEController {
    constructor(
        private readonly sseService: SSESerivce
    ){}

    /**
     * 성공 시, observer 객체 반환.</br>
     * 
     * 실패 시, string 타입의 null 반환
     * 
     * @param request 
     * @param response 
     * @param queryParams 
     */
    @Sse('listen')
    listen(
        @Req() request: Request,
        @Res() response: Response,
        @TypedQuery() queryParams: IQueryParam.ListenSSE
    ) {
        try {
            request.on('close', () => this.sseService.disconnectListener(queryParams.email))
            const obs = this.sseService.listen(
                queryParams.id,
                queryParams.email,
                response,
            )
            
            response.send(obs)
        } catch(e) {
            response.send("null")
        }
    }
}

import { tags } from "typia"

namespace IQueryParam {
    export interface ListenSSE {
        readonly id: string & tags.MaxLength<36>
        readonly email: string & tags.Format<"email"> & tags.MaxLength<255>
    }
}