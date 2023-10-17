import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import {
  JWKS_CLIENT_TOKEN,
  KAKAO_ACCESS_TOKEN_VERIFY_URL,
} from '../constants/auth.constant';
import { catchError, lastValueFrom, map } from 'rxjs';
import { generateBearerHeader } from 'src/common/common';
import * as jwt from 'jsonwebtoken';
import { AxiosRequestConfig } from 'axios';
import JwksRsa, { SigningKey } from 'jwks-rsa';
import { CustomConfigService } from '../../custom-config/services';
import { KakaoErrorCodeEnum } from '../constants/auth.enum';

@Injectable()
export class AuthHelper {
  constructor(
    // @Inject(JWKS_CLIENT_TOKEN) private readonly jwksClient: JwksRsa.JwksClient,
    private readonly httpService: HttpService,
  ) {}

  // async validateAppleAccessToken(appleAccessToken: string) {
  //   const decodedAppleToken = jwt.decode(appleAccessToken, { complete: true });
  //   console.log(decodedAppleToken);

  //   if (!decodedAppleToken?.header?.kid) {
  //     throw new UnauthorizedException('유효하지 않은 토큰입니다!');
  //   }

  //   const applePublicKey: SigningKey = await this.jwksClient.getSigningKey(
  //     decodedAppleToken.header.kid,
  //   );

  //   const appleSignKey = applePublicKey.getPublicKey();

  //   const verifiedAppleDecodedToken = jwt.verify(
  //     appleAccessToken,
  //     appleSignKey,
  //     { complete: true },
  //   );

  //   return '';
  // }
}
