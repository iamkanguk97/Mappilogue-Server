import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IRequestWithUserType } from 'src/types/request-with-user.type';
import { TDecodedUserToken } from '../types';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): TDecodedUserToken => {
    const request = ctx.switchToHttp().getRequest() as IRequestWithUserType;
    return request.user;
  },
);
