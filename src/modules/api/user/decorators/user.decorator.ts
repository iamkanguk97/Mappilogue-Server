import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IRequestWithUserType } from 'src/types/request-with-user.type';
import { TDecodedUserToken } from '../types';

type TUserDecoratorData = keyof TDecodedUserToken;

export const User = createParamDecorator(
  (data: TUserDecoratorData, ctx: ExecutionContext) => {
    // data는 UserEntity의 key들이어야함.
    const request = ctx.switchToHttp().getRequest() as IRequestWithUserType;
    const user = request.user;
    return user[`${data}`] ?? user;
  },
);
