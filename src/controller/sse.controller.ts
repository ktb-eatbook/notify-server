import { 
    Controller, 
    Req, 
    Sse,
} from "@nestjs/common";
import { TypedQuery } from "@nestia/core";
import { Request } from "express";

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
        @TypedQuery() queryParams: QueryParam.ListenSSE
    ) {
        try {
            console.log(`${queryParams.email} 유저 연결 요청`)
            request.on('close', () => {
                this.sseService.disconnectListener(queryParams.email)
                console.log(`${queryParams.email} 유저 연결 해제`)
            })
            const obs = this.sseService.listen(
                queryParams.id,
                queryParams.email,
            )
            
            console.log(`${queryParams.email} 유저 연결 성공`)
            return obs
        } catch(e) {
            console.log(`${queryParams.email} 유저 연결 실패`)
            return null
        }
    }
}

import { tags } from "typia"

namespace QueryParam {
    export interface ListenSSE {
        readonly id: string & tags.MaxLength<36>
        readonly email: string & tags.Format<"email"> & tags.MaxLength<255>
    }
}