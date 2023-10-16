import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { AuthService } from 'src/modules/core/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtRefreshPayload } from 'src/modules/core/auth/types';
import { JwtHelper } from 'src/modules/core/auth/helpers/jwt.helper';
import * as _ from 'lodash';
import { UserHelper } from '../helpers/user.helper';
import { CustomCacheService } from 'src/modules/core/custom-cache/services/custom-cache.service';
import { AuthExceptionCode } from 'src/common/exception-code/auth.exception-code';
import { TokenRefreshResponseDto } from '../dtos/token-refresh-response.dto';

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

  async tokenRefresh(refreshToken: string): Promise<TokenRefreshResponseDto> {
    const refreshPayload = this.jwtService.decode(
      refreshToken,
    ) as JwtRefreshPayload;
    const checkUserStatus = await this.findOneById(refreshPayload.userId);

    const isUserRefreshTokenValidResult =
      await this.userHelper.isUserRefreshTokenValid(
        checkUserStatus,
        refreshPayload,
        refreshToken,
      );

    if (!isUserRefreshTokenValidResult) {
      throw new UnauthorizedException(AuthExceptionCode.InvalidRefreshToken);
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
}
