import { Injectable } from '@nestjs/common';
import { CustomConfigService } from '../../custom-config/services';
import { JwtService } from '@nestjs/jwt';
import { ENVIRONMENT_KEY } from '../../custom-config/constants/custom-config.constant';
import { TokenTypeEnum } from '../constants/auth.enum';
import * as _ from 'lodash';
import { CustomCacheService } from '../../custom-cache/services/custom-cache.service';
import { CustomCacheHelper } from '../../custom-cache/helpers';
import { CustomJwtPayload } from '../types';

@Injectable()
export class JwtHelper {
  constructor(
    private readonly customConfigService: CustomConfigService,
    private readonly customCacheService: CustomCacheService,
    private readonly jwtService: JwtService,
    private readonly customCacheHelper: CustomCacheHelper,
  ) {}

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

  getAccessTokenExpireTime(): string {
    return this.customConfigService.get<string>(ENVIRONMENT_KEY.NODE_ENV) ===
      'development'
      ? '30d'
      : '1h';
  }

  getRefreshTokenExpireTime(): string {
    return this.customConfigService.get<string>(ENVIRONMENT_KEY.NODE_ENV) ===
      'development'
      ? '90d'
      : '14d';
  }

  isRefreshTokenPayloadValid(
    refreshTokenPayload?: CustomJwtPayload | undefined,
  ): boolean {
    return (
      !_.isNil(refreshTokenPayload?.userId) &&
      refreshTokenPayload.sub === TokenTypeEnum.REFRESH
    );
  }

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
