import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import * as _ from 'lodash';
import { StatusColumnEnum } from 'src/constants/enum';
import { JwtHelper } from 'src/modules/core/auth/helpers/jwt.helper';
import { CustomCacheService } from 'src/modules/core/custom-cache/services/custom-cache.service';
import { CustomJwtPayload } from 'src/modules/core/auth/types';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';

@Injectable()
export class UserHelper {
  constructor(
    private readonly jwtHelper: JwtHelper,
    private readonly customCacheService: CustomCacheService,
  ) {}

  isUserValidWithModel(user?: UserEntity | undefined): boolean {
    return !_.isNil(user) && user.status !== StatusColumnEnum.DELETED;
  }

  /**
   * @title refresh-token이 redis에 저장되어있는 refresh-token과  동일한지 확인
   * @param userId
   * @param refreshToken
   * @returns
   */
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

  /**
   * @title 전달받은 refresh-token이 유효한지 확인
   * @param user
   * @param refreshPayload
   * @param refreshToken
   * @returns
   */
  async isUserRefreshTokenValid(
    refreshPayload: CustomJwtPayload,
    refreshToken: string,
    user?: UserEntity | undefined,
  ): Promise<boolean> {
    return (
      this.jwtHelper.isRefreshTokenPayloadValid(refreshPayload) &&
      this.isUserValidWithModel(user) &&
      (await this.isRefreshTokenIsEqualWithRedis(user.id, refreshToken))
    );
  }

  /**
   * @title FCM Token이 유효한지 확인하는 함수
   * @param fcmToken
   * @returns
   */
  async isUserFcmTokenValid(fcmToken?: string | undefined): Promise<boolean> {
    if (_.isNil(fcmToken)) {
      throw new BadRequestException(UserExceptionCode.RequireFcmTokenRegister);
    }

    return true;
  }
}
