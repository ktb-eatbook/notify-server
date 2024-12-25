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
            throw new HttpException(message, HttpStatus.FORBIDDEN)
        }

        const clientIp = (request.ip || request.socket.remoteAddress)?.split("::ffff:")[1]

        if(clientIp === undefined) {
            const message = ERROR.Forbidden.message
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
            throw new HttpException(message, HttpStatus.FORBIDDEN)
        }
    }
}

const localIps = ["localhost","127.0.0.1","0.0.0.0"]