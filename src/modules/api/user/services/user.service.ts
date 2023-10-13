import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { AuthService } from 'src/modules/core/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtRefreshPayload } from 'src/modules/core/auth/types';
import { JwtHelper } from 'src/modules/core/auth/helpers/jwt.helper';
import * as _ from 'lodash';
import { UserHelper } from '../helpers/user.helper';
import { CustomCacheService } from 'src/modules/core/custom-cache/services/custom-cache.service';

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

  async signUp() {
    return;
  }

  async login(user: UserEntity) {
    const result = await this.authService.setUserToken(user.id);
    console.log(result);
  }

  async tokenRefresh(refreshToken: string) {
    const refreshPayload = this.jwtService.decode(
      refreshToken,
    ) as JwtRefreshPayload;

    if (!this.jwtHelper.isRefreshTokenValidInRefresh(refreshPayload)) {
      throw new BadRequestException('잘못된 토큰을 입력하셨습니다.');
    }

    const userId = refreshPayload.userId;
    const checkUserStatus = await this.findOneById(userId);

    if (!this.userHelper.isUserValidWithModel(checkUserStatus)) {
      throw new BadRequestException('탈퇴한 사용자의 토큰입니다.');
    }

    const refreshTokenInRedis = await this.customCacheService.getValue(
      `refresh_userId_${userId}`,
    );

    if (refreshTokenInRedis !== refreshToken) {
      throw new BadRequestException('유효하지 않는 토큰입니다.');
    }

    return await this.authService.setUserToken(userId);
  }

  async findOneById(userId: number): Promise<UserEntity> {
    return await this.userRepository.selectUserById(userId);
  }

  async findOneBySnsId(socialId: string): Promise<UserEntity> {
    return await this.userRepository.selectUserBySnsId(socialId);
  }
}
