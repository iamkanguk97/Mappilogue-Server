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
import { SocialFactoryInterface, SocialKakaoDataInfo } from '../types';
import { USER_DEFAULT_PROFILE_IMAGE } from 'src/modules/api/user/constants/user.constant';
import { UserSnsTypeEnum } from 'src/modules/api/user/constants/user.enum';
import { ProcessedSocialKakaoInfo } from 'src/modules/api/user/types';

export class SocialKakaoFactory implements SocialFactoryInterface {
  private readonly httpService = new HttpService();
  private readonly snsType: UserSnsTypeEnum = UserSnsTypeEnum.KAKAO;
  private readonly socialAccessToken: string;

  constructor(socialAccessToken: string) {
    this.socialAccessToken = socialAccessToken;
  }

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

  async getUserSocialInfo(): Promise<ProcessedSocialKakaoInfo> {
    const requestHeader = generateBearerHeader(this.socialAccessToken);
    const result = await lastValueFrom<SocialKakaoDataInfo>(
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

  processingSocialInfo(
    kakaoInfo: SocialKakaoDataInfo,
  ): ProcessedSocialKakaoInfo {
    const kakaoAccount = kakaoInfo.kakao_account;
    const kakaoProfile = kakaoAccount.profile;

    return {
      snsId: kakaoInfo.id.toString(),
      snsType: this.snsType,
      nickname: kakaoProfile.nickname,
      email: kakaoAccount.email,
      profileImageUrl: kakaoProfile.is_default_image
        ? USER_DEFAULT_PROFILE_IMAGE
        : kakaoProfile.profile_image_url,
      age: kakaoAccount.age_range ?? null,
      gender: kakaoAccount.gender ?? null,
      birthday: kakaoAccount.birthday ?? null,
    };
  }
}
