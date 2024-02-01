import { HttpService } from '@nestjs/axios';
import { CustomConfigService } from '../../custom-config/services';
import { ConfigService } from '@nestjs/config';
import { ENVIRONMENT_KEY } from '../../custom-config/constants/custom-config.constant';
import { lastValueFrom, map } from 'rxjs';
import { BadRequestException } from '@nestjs/common';
import { ISocialFactoryMethod } from '../types';

import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';

export class SocialAppleFactory implements ISocialFactoryMethod {
  private readonly httpService = new HttpService();
  private readonly customConfigService = new CustomConfigService(
    new ConfigService(),
  );

  private readonly appleIdToken: string;

  constructor(appleIdToken: string) {
    this.appleIdToken = appleIdToken;
  }

  /**
   * @summary 클라이언트에서 보낸 token을 검증하는 함수
   * @author  Jason
   */
  async validateSocialAccessToken(): Promise<string> {
    const clientSecret = this.generateAppleClientSecret();

    const data = new URLSearchParams();
    data.append(
      'client_id',
      `${this.customConfigService.get<string>(
        ENVIRONMENT_KEY.APPLE_KEY_CLIENT_ID,
      )}`,
    );
    data.append('client_secret', `${clientSecret}`);
    data.append('code', `${this.appleIdToken}`);
    data.append('grant_type', 'authorization_code');

    const response = await lastValueFrom(
      this.httpService
        .post('https://appleid.apple.com/auth/token', data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .pipe(map((response) => response.data)),
    ).catch((error) => {
      console.log(error);
      throw new BadRequestException('토큰 검증에서 에러가 발생했습니다.');
    });

    console.log(response);
    return '';
  }

  /**
   * @summary 애플 Secret Key를 생성하는 함수
   * @author  Jason
   * @returns { string }
   */
  generateAppleClientSecret(): string {
    const header = {
      alg: 'ES256',
      kid: this.customConfigService.get<string>(ENVIRONMENT_KEY.APPLE_KEY_ID),
    };

    const payload = {
      iss: this.customConfigService.get<string>(
        ENVIRONMENT_KEY.APPLE_KEY_TEAM_ID,
      ),
      iat: Math.floor(Date.now() / 1000),
      exp: 3600,
      aud: 'https://appleid.apple.com',
      sub: this.customConfigService.get<string>(
        ENVIRONMENT_KEY.APPLE_KEY_CLIENT_ID,
      ),
    };

    const privateKey = fs.readFileSync('apple-login-key.p8');
    const clientSecret = jwt.sign(payload, privateKey, { header });
    return clientSecret;
  }
}
