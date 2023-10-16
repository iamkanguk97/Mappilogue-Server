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

  async validateKakaoAccessToken(kakaoAccessToken: string): Promise<string> {
    const requestHeader = generateBearerHeader(kakaoAccessToken);

    return lastValueFrom<string>(
      this.httpService.get(KAKAO_ACCESS_TOKEN_VERIFY_URL, requestHeader).pipe(
        map((res) => String(res.data.id)),
        catchError((err) => {
          const kakaoErrorCode: KakaoErrorCodeEnum = err.response.data.code;
          Logger.error(`[ValidateKakaoAccessToken] ${err} (${kakaoErrorCode})`);
          this.checkKakaoErrorCode(kakaoErrorCode);
          throw err;
        }),
      ),
    );
  }

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

  // TODO: Unauthorized + InternalServerException filter 적용 필요
  checkKakaoErrorCode(kakaoErrorCode: KakaoErrorCodeEnum): Promise<void> {
    switch (kakaoErrorCode) {
      case KakaoErrorCodeEnum.Unauthorized:
        throw new UnauthorizedException();
      case KakaoErrorCodeEnum.KakaoInternalServerError:
        throw new InternalServerErrorException();
      case KakaoErrorCodeEnum.InvalidRequestForm:
        throw new BadRequestException();
      default:
        throw new InternalServerErrorException();
    }
  }
}
