import { HttpService } from '@nestjs/axios';
import { generateBearerHeader } from 'src/common/common';
import { catchError, lastValueFrom, map } from 'rxjs';
import {
  KAKAO_ACCESS_TOKEN_VERIFY_URL,
  KAKAO_GET_USER_INFO_URL,
} from '../constants/auth.constant';
import { KakaoErrorCodeEnum } from '../constants/auth.enum';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InternalServerExceptionCode } from 'src/common/exception-code/internal-server.exception-code';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import {
  USER_DEFAULT_NICKNAME_PREFIX,
  USER_DEFAULT_PROFILE_IMAGE,
} from 'src/modules/api/user/constants/user.constant';
import { UserSnsTypeEnum } from 'src/modules/api/user/constants/user.enum';
import { TProcessedSocialKakaoInfo } from 'src/modules/api/user/types';
import { v4 as uuidv4 } from 'uuid';
import { ISocialFactoryMethod, ISocialKakaoDataInfo } from '../types';

export class SocialKakaoFactory implements ISocialFactoryMethod {
  private readonly httpService = new HttpService();

  private readonly socialAccessToken: string;

  constructor(socialAccessToken: string) {
    this.socialAccessToken = socialAccessToken;
  }

  /**
   * @summary 클라이언트에서 보낸 token을 검증하는 함수
   * @author  Jason
   */
  async validateSocialAccessToken(): Promise<string> {
    const requestHeader = generateBearerHeader(this.socialAccessToken);

    return await lastValueFrom<string>(
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

  async getUserSocialInfo(): Promise<TProcessedSocialKakaoInfo> {
    const requestHeader = generateBearerHeader(this.socialAccessToken);

    const result = await lastValueFrom<ISocialKakaoDataInfo>(
      this.httpService.get(KAKAO_GET_USER_INFO_URL, requestHeader).pipe(
        map((res) => res.data),
        catchError((err) => {
          Logger.error(`[getUserSocialInfo] ${err}`);
          throw new UnauthorizedException(
            UserExceptionCode.InvalidKakaoAccessToken,
          );
        }),
      ),
    );
    return this.processingSocialInfo(result);
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
   * @summary 카카오 소셜로부터 사용자 정보를 정상적으로 받아왔을 때 데이터 처리
   * @author  Jason
   * @param   { ISocialKakaoDataInfo } kakaoInfo
   * @returns { TProcessedSocialKakaoInfo }
   */
  processingSocialInfo(
    kakaoInfo: ISocialKakaoDataInfo,
  ): TProcessedSocialKakaoInfo {
    const kakaoAccount = kakaoInfo?.kakao_account;
    const kakaoProfile = kakaoAccount?.profile;

    return {
      snsId: kakaoInfo.id.toString(),
      snsType: UserSnsTypeEnum.KAKAO,
      nickname:
        kakaoProfile?.nickname ??
        `${USER_DEFAULT_NICKNAME_PREFIX}-${uuidv4().substring(0, 10)}`,
      email: kakaoAccount?.email ?? null,
      profileImageUrl:
        kakaoProfile?.profile_image_url ?? USER_DEFAULT_PROFILE_IMAGE,
      age: kakaoAccount?.age_range ?? null,
      gender: kakaoAccount?.gender ?? null,
      birthday: kakaoAccount?.birthday ?? null,
    };
  }
}
