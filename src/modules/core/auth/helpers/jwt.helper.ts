import { Injectable } from '@nestjs/common';
import { CustomConfigService } from '../../custom-config/services';
import { JwtService } from '@nestjs/jwt';
import { ENVIRONMENT_KEY } from '../../custom-config/constants/custom-config.constant';
import { TokenTypeEnum } from '../constants/auth.enum';
import { CustomCacheService } from '../../custom-cache/services/custom-cache.service';
import { CustomCacheHelper } from '../../custom-cache/helpers';
import { CustomJwtPayload } from '../types';
import { isDefined } from 'src/helpers/common.helper';

@Injectable()
export class JwtHelper {
  constructor(
    private readonly customConfigService: CustomConfigService,
    private readonly customCacheService: CustomCacheService,
    private readonly jwtService: JwtService,
    private readonly customCacheHelper: CustomCacheHelper,
  ) {}

  /**
   * @title Access-Token 생성하는 함수
   * @param userId
   * @returns
   */
  generateAccessToken(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.customConfigService.get<string>(
          ENVIRONMENT_KEY.ACCESS_SECRET_KEY,
        ),
        expiresIn: this.getAccessTokenExpireTime(),
        subject: TokenTypeEnum.ACCESS,
      },
    );
  }

  /**
   * @title Refresh-Token 생성함수
   * @param userId
   * @returns
   */
  generateRefreshToken(userId: number): string {
    return this.jwtService.sign(
      { userId },
      {
        secret: this.customConfigService.get<string>(
          ENVIRONMENT_KEY.REFRESH_SECRET_KEY,
        ),
        expiresIn: this.getRefreshTokenExpireTime(),
        subject: TokenTypeEnum.REFRESH,
      },
    );
  }

  /**
   * @title Access-Token 만료시간 가져오는 함수
   * @returns
   */
  getAccessTokenExpireTime(): string {
    return this.customConfigService.get<string>(ENVIRONMENT_KEY.NODE_ENV) ===
      'development'
      ? '30d'
      : '1h';
  }

  /**
   * @title Refresh-Token 만료시간 가져오는 함수
   * @returns
   */
  getRefreshTokenExpireTime(): string {
    return this.customConfigService.get<string>(ENVIRONMENT_KEY.NODE_ENV) ===
      'development'
      ? '90d'
      : '14d';
  }

  /**
   * @title Refresh-Token의 Payload가 유효한지 확인하는 함수
   * @param refreshTokenPayload
   * @returns
   */
  isRefreshTokenPayloadValid(
    refreshTokenPayload?: CustomJwtPayload | undefined,
  ): boolean {
    return (
      isDefined(refreshTokenPayload?.userId) &&
      refreshTokenPayload.sub === TokenTypeEnum.REFRESH
    );
  }

  /**
   * @title Redis에 저장되어 있는 Refresh-Token Search 하는 Key 가져오는 함수
   * @param userId
   * @returns
   */
  getRefreshTokenRedisKey(userId: number): string {
    return `refresh_userId_${userId}`;
  }

  /**
   * @title Redis에 Refresh-Token 저장하는 함수
   * @param userId
   * @param refreshToken
   */
  async setRefreshTokenInRedis(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    await this.customCacheService.setValueWithTTL(
      this.getRefreshTokenRedisKey(userId),
      refreshToken,
      this.customCacheHelper.convertDayToMs(this.getRefreshTokenExpireTime()),
    );
  }
}
