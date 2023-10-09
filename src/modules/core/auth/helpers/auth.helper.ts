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
  KakaoErrorCode,
} from '../constants/auth.constant';
import { catchError, lastValueFrom, map } from 'rxjs';
import { generateBearerHeader } from 'src/common/common';
import { KakaoErrorCodeType } from '../types';
import * as jwt from 'jsonwebtoken';
import JwksRsa, { SigningKey } from 'jwks-rsa';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class AuthHelper {
  constructor(
    @Inject(JWKS_CLIENT_TOKEN) private readonly jwksClient: JwksRsa.JwksClient,
    private readonly httpService: HttpService,
  ) {}

  async validateKakaoAccessToken(kakaoAccessToken: string): Promise<string> {
    const requestHeader = generateBearerHeader(kakaoAccessToken);

    return lastValueFrom<string>(
      this.httpService.get(KAKAO_ACCESS_TOKEN_VERIFY_URL, requestHeader).pipe(
        map((res) => String(res.data.id)),
        catchError((err) => {
          const kakaoErrorCode: KakaoErrorCodeType = err.response.data.code;
          Logger.error(`[ValidateKakaoAccessToken] ${err} (${kakaoErrorCode})`);
          throw new InternalServerErrorException();
        }),
      ),
    );
  }

  async validateAppleAccessToken(appleAccessToken: string) {
    const decodedAppleToken = jwt.decode(appleAccessToken, { complete: true });
    console.log(decodedAppleToken);

    if (!decodedAppleToken?.header?.kid) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다!');
    }

    const applePublicKey: SigningKey = await this.jwksClient.getSigningKey(
      decodedAppleToken.header.kid,
    );

    const appleSignKey = applePublicKey.getPublicKey();

    const verifiedAppleDecodedToken = jwt.verify(
      appleAccessToken,
      appleSignKey,
      { complete: true },
    );

    return '';
  }

  async temp(fcmToken: string) {
    const headers: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${fcmToken}`,
      },
    };
  }

  checkKakaoErrorCode(kakaoErrorCode: KakaoErrorCodeType): Promise<void> {
    switch (kakaoErrorCode) {
      case KakaoErrorCode.Unauthorized:
        throw new UnauthorizedException();
      case KakaoErrorCode.KakaoInternalServerError:
        throw new InternalServerErrorException();
      case KakaoErrorCode.InvalidRequestForm:
        throw new BadRequestException();
      default:
        throw new InternalServerErrorException();
    }
  }
}
