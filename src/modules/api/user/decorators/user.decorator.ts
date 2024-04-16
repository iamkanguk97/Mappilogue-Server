import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IRequestWithUserType } from 'src/types/request-with-user.type';
import { TDecodedUserToken } from '../types';
import { TPickPrimitive } from 'src/types/pick-primitive.type';
import { UserEntity } from '../entities/user.entity';

type TUserDecoratorParam = keyof TPickPrimitive<UserEntity>;

export const User = createParamDecorator(
  (data: TUserDecoratorParam, ctx: ExecutionContext): TDecodedUserToken => {
    // data는 UserEntity의 key들이어야함.
    const request = ctx.switchToHttp().getRequest() as IRequestWithUserType;
    return request.user;
  },
);
