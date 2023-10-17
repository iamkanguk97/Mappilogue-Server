import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_DECORATOR_KEY } from '../constants/auth.constant';
import * as _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { CustomConfigService } from '../../custom-config/services';
import { ENVIRONMENT_KEY } from '../../custom-config/constants/custom-config.constant';
import { UserService } from 'src/modules/api/user/services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly customConfigService: CustomConfigService,
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
    const token = this.extractTokenFromHeader(request);

    if (_.isNil(token)) {
      throw new BadRequestException('Access-Token을 입력해주세요');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.customConfigService.get<string>(
          ENVIRONMENT_KEY.ACCESS_SECRET_KEY,
        ),
      });

      const findUser = await this.userService.findOneById(payload.id);
      if (!findUser || findUser.status !== 'ACTIVE') {
        throw new BadRequestException('탈퇴한 유저입니다.');
      }

      request.user = {
        id: findUser.id,
        nickname: findUser.nickname,
        email: findUser.email,
        profileImageUrl: findUser.profileImageUrl,
        profileImageKey: findUser.profileImageKey,
        snsType: findUser.snsType,
      };

      return true;
    } catch (err) {
      Logger.error(err);
      if (!err.status) {
        throw new UnauthorizedException();
      }
      throw err;
    }
  }

  extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : '';
  }
}
