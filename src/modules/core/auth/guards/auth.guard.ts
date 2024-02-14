import { encryptEmail } from 'src/helpers/crypt.helper';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_DECORATOR_KEY } from '../constants/auth.constant';
import { JwtService } from '@nestjs/jwt';
import { CustomConfigService } from '../../custom-config/services';
import { ENVIRONMENT_KEY } from '../../custom-config/constants/custom-config.constant';
import { UserService } from 'src/modules/api/user/services/user.service';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { isDefined } from 'src/helpers/common.helper';
import { ICustomJwtPayload } from '../types';
import { TDecodedUserToken } from 'src/modules/api/user/types';
import { extractTokenFromHeader } from 'src/common/common';
import {
  CustomCacheService,
  TOKEN_BLACK_LIST_KEY,
} from '../../custom-cache/services/custom-cache.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly customConfigService: CustomConfigService,
    private readonly customCacheService: CustomCacheService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_DECORATOR_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);

    if (token === '') {
      throw new BadRequestException(UserExceptionCode.AccessTokenEmpty);
    }

    try {
      const checkBlackListResult = await this.customCacheService.getValue(
        token,
      );

      if (checkBlackListResult === TOKEN_BLACK_LIST_KEY) {
        throw new ForbiddenException(UserExceptionCode.AccessTokenInBlackList);
      }

      const payload = (await this.jwtService.verifyAsync(token, {
        secret: this.customConfigService.get<string>(
          ENVIRONMENT_KEY.ACCESS_SECRET_KEY,
        ),
      })) as ICustomJwtPayload;

      const findUser = await this.userService.findOneById(payload.userId);
      if (!isDefined(findUser)) {
        throw new ForbiddenException(UserExceptionCode.NotExistUser);
      }

      request.user = {
        id: findUser.id,
        nickname: findUser.nickname,
        email: !isDefined(findUser.email) ? null : encryptEmail(findUser.email),
        profileImageUrl: findUser.profileImageUrl,
        profileImageKey: findUser.profileImageKey ?? '',
        snsType: findUser.snsType,
      } as TDecodedUserToken;

      return true;
    } catch (err) {
      const error = err as { status?: unknown };
      this.logger.error(`[AuthGuard] ${err}`);
      if (!error.status) {
        throw new UnauthorizedException(UserExceptionCode.InvalidAccessToken);
      }
      throw err;
    }
  }
}
