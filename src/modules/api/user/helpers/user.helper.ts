import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import * as _ from 'lodash';
import { StatusColumnEnum } from 'src/constants/enum';
import { JwtHelper } from 'src/modules/core/auth/helpers/jwt.helper';
import { JwtRefreshPayload } from 'src/modules/core/auth/types';
import { CustomCacheService } from 'src/modules/core/custom-cache/services/custom-cache.service';

@Injectable()
export class UserHelper {
  constructor(
    private readonly jwtHelper: JwtHelper,
    private readonly customCacheService: CustomCacheService,
  ) {}

  isUserValidWithModel(user: UserEntity): boolean {
    return !_.isNil(user) && user.status !== StatusColumnEnum.DELETED;
  }

  async isRefreshTokenIsEqualWithRedis(
    userId: number,
    refreshToken: string,
  ): Promise<boolean> {
    return (
      (await this.customCacheService.getValue(
        this.jwtHelper.getRefreshTokenRedisKey(userId),
      )) === refreshToken
    );
  }

  async isUserRefreshTokenValid(
    user: UserEntity,
    refreshPayload: JwtRefreshPayload,
    refreshToken: string,
  ): Promise<boolean> {
    console.log(user);
    console.log(refreshPayload);
    return (
      this.jwtHelper.isRefreshTokenPayloadValid(refreshPayload) &&
      this.isUserValidWithModel(user) &&
      (await this.isRefreshTokenIsEqualWithRedis(user.id, refreshToken))
    );
  }
}
