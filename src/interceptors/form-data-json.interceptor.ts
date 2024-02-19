import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { CommonExceptionCode } from 'src/common/exception-code/common.exception-code';

@Injectable()
export class FormDataJsonInterceptor implements NestInterceptor {
  intercept<T>(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T> | Promise<Observable<T>> {
    const request = context.switchToHttp().getRequest<Request>();

    try {
      const body = JSON.parse(request.body.data);
      request.body = body;
    } catch (err) {
      throw new BadRequestException(
        CommonExceptionCode.MultipartJsonFormatError,
      );
    }

    return next.handle();
  }
}
