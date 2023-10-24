import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { AuthService } from 'src/modules/core/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  CustomJwtPayload,
  SocialFactoryType,
} from 'src/modules/core/auth/types';
import { JwtHelper } from 'src/modules/core/auth/helpers/jwt.helper';
import { UserHelper } from '../helpers/user.helper';
import { CustomCacheService } from 'src/modules/core/custom-cache/services/custom-cache.service';
import { TokenRefreshResponseDto } from '../dtos/token-refresh-response.dto';
import { LoginOrSignUpResponseDto } from '../dtos/login-or-sign-up-response.dto';
import { LoginOrSignUpEnum } from '../constants/user.enum';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { ProcessedSocialKakaoInfo } from '../types';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userHelper: UserHelper,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly jwtHelper: JwtHelper,
    private readonly customCacheService: CustomCacheService,
  ) {}

  async signUp(
    userSocialFactory: SocialFactoryType,
    fcmToken?: string | undefined,
  ): Promise<LoginOrSignUpResponseDto> {
    const socialUserInfo = (await userSocialFactory.getUserSocialInfo()) as
      | ProcessedSocialKakaoInfo
      | any;

    const newUserId = await this.create(socialUserInfo, fcmToken);
    console.log(newUserId);
    const newTokens = await this.authService.setUserToken(newUserId);
    console.log(newTokens);
    return LoginOrSignUpResponseDto.from(
      LoginOrSignUpEnum.SIGNUP,
      newUserId,
      newTokens,
    );
  }

  async login(
    user: UserEntity,
    fcmToken?: string | undefined,
  ): Promise<LoginOrSignUpResponseDto> {
    return LoginOrSignUpResponseDto.from(
      LoginOrSignUpEnum.LOGIN,
      user.id,
      await this.authService.setUserToken(user.id),
    );
  }

  async tokenRefresh(refreshToken: string): Promise<TokenRefreshResponseDto> {
    const refreshPayload = this.jwtService.decode(
      refreshToken,
    ) as CustomJwtPayload;
    const checkUserStatus = await this.findOneById(refreshPayload.userId);

    const isUserRefreshTokenValidResult =
      await this.userHelper.isUserRefreshTokenValid(
        checkUserStatus,
        refreshPayload,
        refreshToken,
      );

    if (!isUserRefreshTokenValidResult) {
      throw new UnauthorizedException(UserExceptionCode.InvalidRefreshToken);
    }

    const userId = refreshPayload.userId;
    const result = await this.authService.setUserToken(userId);
    return TokenRefreshResponseDto.from(userId, result);
  }

  async findOneById(userId: number): Promise<UserEntity | undefined> {
    return await this.userRepository.selectUserById(userId);
  }

  async findOneBySnsId(socialId: string): Promise<UserEntity | undefined> {
    return await this.userRepository.selectUserBySnsId(socialId);
  }

  async create(
    socialUserInfo: ProcessedSocialKakaoInfo,
    fcmToken?: string | undefined,
  ): Promise<number> {
    return await this.userRepository.insertUser({
      ...socialUserInfo,
      fcmToken,
    });
  }

  async modifyById(
    userId: number,
    properties: Partial<UserEntity>,
  ): Promise<void> {
    return await this.userRepository.updateById(userId, properties);
  }

  async logout(userId: number): Promise<void> {
    const refreshTokenRedisKey = this.jwtHelper.getRefreshTokenRedisKey(userId);
    await Promise.all([
      this.customCacheService.delValue(refreshTokenRedisKey),
      this.modifyById(userId, { fcmToken: null }),
    ]);
  }
}
