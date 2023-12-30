import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { JwtHelper } from 'src/modules/core/auth/helpers/jwt.helper';
import { CustomCacheService } from 'src/modules/core/custom-cache/services/custom-cache.service';
import { CustomJwtPayload } from 'src/modules/core/auth/types';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { isDefined } from 'src/helpers/common.helper';
import { NotificationErrorCodeEnum } from 'src/modules/core/notification/constants/notification.enum';

import * as firebase from 'firebase-admin';
import { UserAlarmSettingEntity } from '../entities/user-alarm-setting.entity';
import { UserAlarmHistoryEntity } from '../entities/user-alarm-history.entity';
import { UserWithdrawReasonEntity } from '../entities/user-withdraw-reason.entity';

@Injectable()
export class UserHelper {
  private readonly logger = new Logger(UserHelper.name);

  constructor(
    private readonly jwtHelper: JwtHelper,
    private readonly customCacheService: CustomCacheService,
  ) {}

  /**
   * @summary refresh-token이 redis에 저장되어있는 refresh-token과  동일한지 확인
   * @author  Jason
   * @param   { number } userId
   * @param   { string } refreshToken
   * @returns { Promise<boolean> }
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
   * @summary 전달받은 refresh-token이 유효한지 확인
   * @author  Jason
   *
   * @param   { CustomJwtPayload } refreshPayload
   * @param   { string } refreshToken
   * @param   { UserEntity | undefined } user
   *
   * @returns { Promise<boolean> }
   */
  async isUserRefreshTokenValid(
    refreshPayload: CustomJwtPayload,
    refreshToken: string,
    user?: UserEntity | undefined,
  ): Promise<boolean> {
    return (
      isDefined(user) &&
      this.jwtHelper.isRefreshTokenPayloadValid(refreshPayload) &&
      (await this.isRefreshTokenIsEqualWithRedis(user.id, refreshToken))
    );
  }

  /**
   * @summary FCM Token이 유효한지 확인하는 함수
   * @author Jason
   *
   * @param fcmToken
   */
  async isUserFcmTokenValid(fcmToken?: string | undefined): Promise<boolean> {
    try {
      // fcmToken 유무 확인
      if (!isDefined(fcmToken)) {
        throw new BadRequestException(
          UserExceptionCode.RequireFcmTokenRegister,
        );
      }

      // fcmToken 유효성 확인 (malformed or not-registered)
      await firebase.messaging().send(
        {
          token: fcmToken,
        },
        true,
      );

      return true;
    } catch (err) {
      this.logger.error(`[UserHelper - isUserFcmTokenValid] ${err}`);

      switch (err.errorInfo.code) {
        case NotificationErrorCodeEnum.INVALID_ARGUMENT:
          throw new BadRequestException(UserExceptionCode.InvalidFcmToken);
        case NotificationErrorCodeEnum.NOT_REGISTERED_FCM_TOKEN:
          throw new BadRequestException(UserExceptionCode.FcmTokenExpired);
        default:
          throw err;
      }
    }
  }

  /**
   * @summary 사용자 수정 조건 생성 함수
   * @author  Jason
   * @param   { number } id
   * @returns { Pick<UserEntity, 'id'> }
   */
  setUpdateUserCriteria(id: number): Pick<UserEntity, 'id'> {
    return { id };
  }

  /**
   * @summary 사용자 연관 도메인 수정 조건 생성함수
   * @author  Jason
   * @param   { number } userId
   * @returns { Pick<UserAlarmSettingEntity | UserAlarmHistoryEntity | UserWithdrawReasonEntity, 'userId'> }
   */
  setUpdateUserCriteriaByUserId(
    userId: number,
  ): Pick<
    UserAlarmSettingEntity | UserAlarmHistoryEntity | UserWithdrawReasonEntity,
    'userId'
  > {
    return { userId };
  }
}
