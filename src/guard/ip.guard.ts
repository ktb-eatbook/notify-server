import { 
    CanActivate, 
    ExecutionContext, 
    HttpException, 
    HttpStatus, 
    Injectable 
} from "@nestjs/common";
import { Request } from "express"
import * as geoip from 'geoip-lite';

import { ERROR } from "../common";

@Injectable()
export class IPGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const method = request.method

        // 웹의 요청은 POST 만 허용
        if(method !== "POST") {
            const message = ERROR.Forbidden.message
            console.log(`허용되지 않은 메소드 요청: ${method}`)
            throw new HttpException(message, HttpStatus.FORBIDDEN)
        }

        // 공유기 접근 시, 실제 아이피 식별을 위한 헤더 추출
        const forwardedFor = request.headers['x-forwarded-for']
        const clientIp = (forwardedFor ?(Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor.split(',')[0]) : (request.ip || request.socket.remoteAddress))?.split("::ffff:")[1]
        console.log(forwardedFor)
        console.log(clientIp)

        if(clientIp === undefined) {
            const message = ERROR.Forbidden.message
            console.log(`아이피가 존재하지 않은 요청`)
            throw new HttpException(message, HttpStatus.FORBIDDEN)
        }

        // 로컬 접근 허용
        if(localIps.includes(clientIp)) {
            return true
        }

        // 한국에서 온 요청만 허용
        const geo = geoip.lookup(clientIp)
        if(geo?.country === "KR") {
            return true
        } else {
            const message = ERROR.Forbidden.message
            console.log(`허용되지 않은 국가에서의 요청\n아이피:${clientIp}\nGeolocation: ${geo}`)
            throw new HttpException(message, HttpStatus.FORBIDDEN)
        }
    }
}

const localIps = ["localhost","127.0.0.1"]