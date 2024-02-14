import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { extractTokenFromHeader } from 'src/common/common';
import {
  ICustomJwtPayload,
  ITokenWithExpireTime,
} from 'src/modules/core/auth/types';

import * as jwt from 'jsonwebtoken';

export const AccessTokenWithExpire = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const token = extractTokenFromHeader(request);
    const payload = jwt.decode(token) as ICustomJwtPayload;

    return {
      user: request.user,
      accessToken: token,
      remainExpireTime: payload.exp - payload.iat,
    } as ITokenWithExpireTime;
  },
);
