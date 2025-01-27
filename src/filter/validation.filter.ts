import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    BadRequestException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { TypeGuardError } from 'typia';
import { Response } from 'express';

import { ERROR } from '../common';

const logger: Logger = new Logger("ValidationExceptionFilter")

/// typia 타입 Exception을 포함한 모든 input 에러를 catch하기 위한 필터 
@Catch(BadRequestException, TypeGuardError)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(_: BadRequestException | TypeGuardError, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        
        logger.error(`${_}`)
        response.status(HttpStatus.BAD_REQUEST).json(ERROR.BadRequest)
    }
}