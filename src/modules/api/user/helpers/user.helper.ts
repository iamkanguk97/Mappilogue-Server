import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { JwtHelper } from 'src/modules/core/auth/helpers/jwt.helper';
import { CustomCacheService } from 'src/modules/core/custom-cache/services/custom-cache.service';
import {
  IAppleJwtTokenPayload,
  ICustomJwtPayload,
  ISocialKakaoDataInfo,
  IVerifyAppleAuthCode,
} from 'src/modules/core/auth/types';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { isDefined } from 'src/helpers/common.helper';
import { NotificationErrorCodeEnum } from 'src/modules/core/notification/constants/notification.enum';
import { PostLoginOrSignUpRequestDto } from '../dtos/request/post-login-or-sign-up-request.dto';
import { UserSnsTypeEnum } from '../constants/enums/user.enum';
import { AuthService } from 'src/modules/core/auth/services/auth.service';
import {
  USER_DEFAULT_NICKNAME_PREFIX,
  USER_DEFAULT_PROFILE_IMAGE,
} from '../constants/user.constant';
import { v4 as uuidv4 } from 'uuid';

import * as firebase from 'firebase-admin';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserHelper {
  private readonly logger = new Logger(UserHelper.name);

  constructor(
    private readonly jwtHelper: JwtHelper,
    private readonly customCacheService: CustomCacheService,
    private readonly authService: AuthService,
  ) {}

  /**
   * @summary refresh-token이 redis에 저장되어있는 refresh-token과 동일한지 확인
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
   * @param   { string } refreshToken
   * @param   { ICustomJwtPayload } refreshPayload
   * @param   { UserEntity | null } user
   * @returns { Promise<boolean> }
   */
  async isUserRefreshTokenValid(
    refreshToken: string,
    refreshPayload: ICustomJwtPayload | null,
    user: UserEntity | null,
  ): Promise<boolean> {
    return (
      isDefined(user) &&
      this.jwtHelper.isRefreshTokenPayloadValid(refreshPayload) &&
      (await this.isRefreshTokenIsEqualWithRedis(user.id, refreshToken))
    );
  }

  /**
   * @summary FCM Token이 유효한지 확인하는 함수
   * @author  Jason
   * @param   { string } fcmToken
   * @returns { Promise<boolean> }
   */
  async isUserFcmTokenValid(fcmToken: string): Promise<boolean> {
    try {
      // fcmToken 유효성 확인 (malformed or not-registered)
      await firebase.messaging().send(
        {
          token: fcmToken,
        },
        true, // dryRun option: Test를 위한 옵션
      );

      return true;
    } catch (err) {
      this.logger.error(`[UserHelper - isUserFcmTokenValid] ${err}`);

      const error = err as { errorInfo?: { code: string } };

      if (isDefined(error.errorInfo)) {
        switch (error.errorInfo.code) {
          case NotificationErrorCodeEnum.INVALID_ARGUMENT:
            throw new BadRequestException(UserExceptionCode.InvalidFcmToken);
          case NotificationErrorCodeEnum.NOT_REGISTERED_FCM_TOKEN:
            throw new BadRequestException(UserExceptionCode.FcmTokenExpired);
          default:
            throw err;
        }
      }
      throw err;
    }
  }

  /**
   * @summary 사용자 랜덤 닉네임 생성
   * @author  Jason
   * @returns { string }
   */
  generateUserRandomNickname(): string {
    return `${USER_DEFAULT_NICKNAME_PREFIX}-${uuidv4()
      .replace(/-/g, '')
      .substring(0, 10)}`;
  }

  /**
   * @summary 회원가입 시 새로운 유저 생성을 위한 Property 생성
   * @author  Jason
   * @param   { PostLoginOrSignUpRequestDto } body
   * @param   { IVerifyAppleAuthCode | null } validateResult
   * @returns { Promise<UserEntity> }
   */
  generateInsertUserParam(
    body: PostLoginOrSignUpRequestDto,
    validateResult: IVerifyAppleAuthCode | null,
  ): Promise<UserEntity> {
    switch (body.socialVendor) {
      case UserSnsTypeEnum.KAKAO:
        return this.generateKakaoInsertUserParam(body);
      case UserSnsTypeEnum.APPLE:
        return this.generateAppleInsertUserParam(
          body,
          validateResult as IVerifyAppleAuthCode,
        );
      default:
        throw new BadRequestException(UserExceptionCode.SocialVendorErrorType);
    }
  }

  /**
   * @summary 카카오 로그인 사용자 회원가입 Property 생성
   * @author  Jason
   * @param   { PostLoginOrSignUpRequestDto } body
   * @returns { Promise<UserEntity> }
   */
  async generateKakaoInsertUserParam(
    body: PostLoginOrSignUpRequestDto,
  ): Promise<UserEntity> {
    const kakaoUserInfo = await this.authService.getKakaoUserSocialInfo(
      body.socialAccessToken,
    );

    const kakaoAccount = kakaoUserInfo?.kakao_account;
    const kakaoProfile = kakaoAccount?.profile;

    const user = new UserEntity();

    user.snsId = kakaoUserInfo.id.toString();
    user.snsType = UserSnsTypeEnum.KAKAO;
    user.nickname = kakaoProfile?.nickname ?? this.generateUserRandomNickname();
    user.email = kakaoAccount?.email ?? null;
    user.age = kakaoAccount?.age_range ?? null;
    user.gender = kakaoAccount?.gender ?? null;
    user.birthday = kakaoAccount?.birthday ?? null;
    user.profileImageUrl = this.setKakaoUserProfileImage(kakaoAccount);
    user.profileImageKey = null;
    user.appleRefreshToken = null;
    user.fcmToken =
      isDefined(body.fcmToken) && body.fcmToken.length !== 0
        ? body.fcmToken
        : null;

    return user;
  }

  /**
   * @summary 애플 로그인 사용자 회원가입 Property 생성
   * @author  Jason
   * @param   { PostLoginOrSignUpRequestDto } body
   * @returns { Promise<UserEntity> }
   */
  async generateAppleInsertUserParam(
    body: PostLoginOrSignUpRequestDto,
    validateResult: IVerifyAppleAuthCode,
  ): Promise<UserEntity> {
    const decodedResult = jwt.decode(
      validateResult.id_token,
    ) as IAppleJwtTokenPayload;

    const user = new UserEntity();

    user.snsId = decodedResult.sub;
    user.snsType = UserSnsTypeEnum.APPLE;
    user.nickname = this.generateUserRandomNickname();
    user.email = decodedResult.email ?? null;
    user.age = null;
    user.gender = null;
    user.birthday = null;
    user.profileImageUrl = USER_DEFAULT_PROFILE_IMAGE;
    user.profileImageKey = null;
    user.appleRefreshToken = validateResult.refresh_token;
    user.fcmToken =
      isDefined(body.fcmToken) && body.fcmToken.length !== 0
        ? body.fcmToken
        : null;

    return user;
  }

  /**
   * @summary 카카오 로그인 정보에서 프로필 이미지 추출하기
   * @author  Jason
   * @param   { ISocialKakaoDataInfo['kakao_account'] } kakao_account
   * @returns { string }
   */
  setKakaoUserProfileImage(
    kakao_account?: ISocialKakaoDataInfo['kakao_account'],
  ): string {
    const agreement = kakao_account?.profile_image_needs_agreement;
    const isDefaultImage = kakao_account?.profile?.is_default_image;
    const profileImageUrl = kakao_account?.profile?.profile_image_url;

    const condition =
      !isDefined(agreement) ||
      !agreement ||
      !isDefined(isDefaultImage) ||
      isDefaultImage ||
      !isDefined(profileImageUrl);

    if (condition) {
      return USER_DEFAULT_PROFILE_IMAGE;
    }
    return profileImageUrl;
  }
}
