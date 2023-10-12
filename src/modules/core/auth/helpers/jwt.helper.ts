import { Injectable } from '@nestjs/common';
import { CustomConfigService } from '../../custom-config/services';
import { JwtService } from '@nestjs/jwt';
import { ENVIRONMENT_KEY } from '../../custom-config/constants/custom-config.constant';
import { TokenTypeEnum } from '../constants/auth.enum';

@Injectable()
export class JwtHelper {
  constructor(
    private readonly customConfigService: CustomConfigService,
    private readonly jwtService: JwtService,
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

  // verifyAccessToken(accessToken: string) {
  //   return this.jwtService.verify(accessToken, {
  //     secret: this.customConfigService.get<string>(
  //       ENVIRONMENT_KEY.ACCESS_SECRET_KEY,
  //     ),
  //   });
  // }
}
