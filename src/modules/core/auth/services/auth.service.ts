import { CustomConfigService } from 'src/modules/core/custom-config/services';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtHelper } from '../helpers/jwt.helper';
import { TokenDto } from 'src/modules/api/user/dtos/token.dto';
import { UserSnsTypeEnum } from 'src/modules/api/user/constants/user.enum';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { generateBearerHeader } from 'src/common/common';
import { catchError, lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import {
  KAKAO_ACCESS_TOKEN_VERIFY_URL,
  KAKAO_GET_USER_INFO_URL,
} from '../constants/auth.constant';
import { KakaoErrorCodeEnum } from '../constants/auth.enum';
import { InternalServerExceptionCode } from 'src/common/exception-code/internal-server.exception-code';
import { PostLoginOrSignUpRequestDto } from 'src/modules/api/user/dtos/login-or-sign-up-request.dto';
import { ENVIRONMENT_KEY } from '../../custom-config/constants/custom-config.constant';
import {
  IAppleJwtTokenPayload,
  ISocialKakaoDataInfo,
  IVerifyAppleAuthCode,
} from '../types';

import axios from 'axios';
import * as querystring from 'querystring';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from 'src/modules/api/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly customConfigService: CustomConfigService,
    private readonly jwtHelper: JwtHelper,
  ) {}

  private readonly httpService = new HttpService();
  private readonly logger = new Logger(AuthService.name);

  /**
   * @summary 사용자 토큰 설정
   * @author  Jason
   * @param   { number } userId
   * @returns { Promise<TokenDto> }
   */
  async setUserToken(userId: number): Promise<TokenDto> {
    const accessToken = this.jwtHelper.generateAccessToken(userId);
    const refreshToken = this.jwtHelper.generateRefreshToken(userId);
    await this.jwtHelper.setRefreshTokenInRedis(userId, refreshToken);
    return TokenDto.from(accessToken, refreshToken);
  }

  /**
   * @summary 소셜 별로 구분지어서 클라에서 보내준 토큰 검증하기
   * @author  Jason
   * @param   { PostLoginOrSignUpRequestDto } body
   * @returns { Promise<string> } ==> 소셜 고유 아이디만 먼저 반환
   */
  async validateSocialAccessToken(
    body: PostLoginOrSignUpRequestDto,
  ): Promise<string> {
    switch (body.socialVendor) {
      case UserSnsTypeEnum.KAKAO:
        return this.validateKakaoSocialAccessToken(body.socialAccessToken);
      case UserSnsTypeEnum.APPLE:
        return this.validateAppleSocialAccessToken(body.socialAccessToken);
      default:
        throw new BadRequestException(UserExceptionCode.SocialVendorErrorType);
    }
  }

  /**
   * @summary 카카오 소셜 Access-Token을 받아서 검증 후 소셜ID를 추출함
   * @author  Jason
   * @param   { string } token
   * @returns { Promise<string> }
   */
  async validateKakaoSocialAccessToken(token: string): Promise<string> {
    return await lastValueFrom<string>(
      this.httpService
        .get(KAKAO_ACCESS_TOKEN_VERIFY_URL, generateBearerHeader(token))
        .pipe(
          map((res) => res.data.id),
          catchError((err) => {
            const kakaoErrorCode: KakaoErrorCodeEnum = err.response.data.code;
            this.logger.error(
              `[ValidateKakaoAccessToken] ${err} (${kakaoErrorCode})`,
            );
            this.checkKakaoErrorCode(kakaoErrorCode);
            throw err;
          }),
        ),
    );
  }

  /**
   * @summary 애플 authorization_code를 받아서 검증 후 소셜ID를 추출함
   * @author  Jason
   * @param   { string } code
   * @returns { Promise<string> }
   */
  async validateAppleSocialAccessToken(code: string): Promise<string> {
    const verifyResult = await this.verifyAppleAuthCode(code);
    const decodedIdToken = jwt.decode(
      verifyResult.id_token,
    ) as IAppleJwtTokenPayload;
    return decodedIdToken.sub;
  }

  /**
   * @summary 카카오 소셜로그인 중 에러 발생했을 때 에러코드 분류
   * @author  Jason
   * @param   { KakaoErrorCodeEnum } kakaoErrorCode
   */
  checkKakaoErrorCode(kakaoErrorCode: KakaoErrorCodeEnum): Promise<void> {
    switch (kakaoErrorCode) {
      case KakaoErrorCodeEnum.Unauthorized:
        throw new UnauthorizedException(
          UserExceptionCode.InvalidKakaoAccessToken,
        );
      case KakaoErrorCodeEnum.KakaoInternalServerError:
        throw new InternalServerErrorException(
          InternalServerExceptionCode.KakaoInternalServerError,
        );
      case KakaoErrorCodeEnum.InvalidRequestForm:
        throw new BadRequestException(
          UserExceptionCode.InvalidKakaoRequestForm,
        );
      default:
        throw new InternalServerErrorException(
          InternalServerExceptionCode.InternalServerError,
        );
    }
  }

  /**
   * @summary 애플 Secret Key를 생성하는 함수
   * @author  Jason
   * @returns { string }
   */
  generateAppleClientSecret(): string {
    try {
      const applePrivateKey = fs.readFileSync(
        'apple-social-login-key.p8',
        'utf8',
      );

      return jwt.sign({}, applePrivateKey, {
        algorithm: 'ES256',
        expiresIn: 3600,
        audience: 'https://appleid.apple.com',
        issuer: this.customConfigService.get<string>(
          ENVIRONMENT_KEY.APPLE_KEY_TEAM_ID,
        ), // TEAM_ID ==> APP ID PREFIX
        subject: this.customConfigService.get<string>(
          ENVIRONMENT_KEY.APPLE_KEY_CLIENT_ID,
        ), // CLIENT_ID ==> APP BUNDLE ID
        keyid: this.customConfigService.get<string>(
          ENVIRONMENT_KEY.APPLE_KEY_ID,
        ), // APP KEY ID
      });
    } catch (err) {
      this.logger.error(`[generateAppleClientSecret] SecretKey 생성 오류`);
      throw new InternalServerErrorException(
        InternalServerExceptionCode.CreateAppleSecretKeyError,
      );
    }
  }

  /**
   * @summary 애플 authorization_code를 가지고 Apple 서버에 검증을 요청하고 나온 결과 반환
   * @author  Jason
   * @param   { string } code
   * @returns { Promise<IVerifyAppleAuthCode> }
   */
  async verifyAppleAuthCode(code: string): Promise<IVerifyAppleAuthCode> {
    try {
      return (await axios.post(
        'https://appleid.apple.com/auth/token',
        querystring.stringify({
          grant_type: 'authorization_code',
          code: code,
          client_secret: this.generateAppleClientSecret(),
          client_id: this.customConfigService.get<string>(
            ENVIRONMENT_KEY.APPLE_KEY_CLIENT_ID,
          ),
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )) as IVerifyAppleAuthCode;
    } catch (err) {
      this.logger.error(
        '[validateSocialAccessToken] 애플 로그인 처리 중 에러 발생.',
      );
      throw new UnauthorizedException(
        UserExceptionCode.AppleSocialLoginTokenError,
      );
    }
  }

  async getKakaoUserSocialInfo(token: string): Promise<ISocialKakaoDataInfo> {
    return await lastValueFrom<ISocialKakaoDataInfo>(
      this.httpService
        .get(KAKAO_GET_USER_INFO_URL, generateBearerHeader(token))
        .pipe(
          map((res) => res.data),
          catchError((err) => {
            this.logger.error(`[getKakaoUserSocialInfo] ${err}`);
            throw new UnauthorizedException(
              UserExceptionCode.InvalidKakaoAccessToken,
            );
          }),
        ),
    );
  }

  generateInsertUserParam(body: PostLoginOrSignUpRequestDto) {
    switch (body.socialVendor) {
      case UserSnsTypeEnum.KAKAO:
        return this.generateKakaoInsertUserParam(body.socialAccessToken);
      case UserSnsTypeEnum.APPLE:
        return this.generateAppleInsertUserParam(body.socialAccessToken);
      default:
        throw new BadRequestException(UserExceptionCode.SocialVendorErrorType);
    }
  }

  async generateKakaoInsertUserParam(token: string): Promise<UserEntity> {
    const kakaoUserInfo = await this.getKakaoUserSocialInfo(token);

    const kakaoAccount = kakaoUserInfo?.kakao_account;
    const kakaoProfile = kakaoAccount?.profile;

    const user = new UserEntity();

    user.snsId = kakaoUserInfo.id.toString();
    user.snsType = UserSnsTypeEnum.KAKAO;
    user.nickname = kakaoProfile?.nickname ?? '안녕!';
    user.email = kakaoAccount?.email ?? '';

    return user;
  }

  async generateAppleInsertUserParam(code: string) {
    const verifyResult = await this.verifyAppleAuthCode(code);
    const decodedIdToken = jwt.decode(
      verifyResult.id_token,
    ) as IAppleJwtTokenPayload;

    const user = new UserEntity();

    user.snsId = decodedIdToken.sub;
    user.snsType = UserSnsTypeEnum.APPLE;
    user.nickname = '안녕!';
    user.email = '';
  }
}
