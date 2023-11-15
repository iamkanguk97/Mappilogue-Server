import { UserHelper } from './../../../api/user/helpers/user.helper';
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
import { Request } from 'express';
import { IS_PUBLIC_DECORATOR_KEY } from '../constants/auth.constant';
import { JwtService } from '@nestjs/jwt';
import { CustomConfigService } from '../../custom-config/services';
import { ENVIRONMENT_KEY } from '../../custom-config/constants/custom-config.constant';
import { UserService } from 'src/modules/api/user/services/user.service';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { CustomJwtPayload } from '../types';
import { isDefined } from 'src/helpers/common.helper';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly customConfigService: CustomConfigService,
    private readonly userService: UserService,
    private readonly userHelper: UserHelper,
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
    const token = this.extractTokenFromHeader(request);

    if (token === '') {
      throw new BadRequestException(UserExceptionCode.AccessTokenEmpty);
    }

    try {
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: this.customConfigService.get<string>(
          ENVIRONMENT_KEY.ACCESS_SECRET_KEY,
        ),
      })) as CustomJwtPayload;

      const findUser = await this.userService.findOneById(payload.userId);
      if (!isDefined(findUser)) {
        throw new ForbiddenException(UserExceptionCode.NotExistUser);
      }

      request.user = {
        id: findUser.id,
        nickname: findUser.nickname,
        email: encryptEmail(findUser.email),
        profileImageUrl: findUser.profileImageUrl,
        profileImageKey: findUser.profileImageKey ?? '',
        snsType: findUser.snsType,
      };

      return true;
    } catch (err) {
      this.logger.error(`[AuthGuard] ${err}`);
      if (!err.status) {
        throw new UnauthorizedException(UserExceptionCode.InvalidAccessToken);
      }
      throw err;
    }
  }

  extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : '';
  }
}
