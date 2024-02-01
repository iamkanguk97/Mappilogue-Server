import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { UserService } from '../services/user.service';
import { TokenRefreshRequestDto } from '../dtos/token-refresh-request.dto';
import { TokenRefreshResponseDto } from '../dtos/token-refresh-response.dto';
import { Public } from 'src/modules/core/auth/decorators/auth.decorator';
import { UserId } from '../decorators/user-id.decorator';
import { User } from '../decorators/user.decorator';
import { TDecodedUserToken } from '../types';
import { PostUserWithdrawRequestDto } from '../dtos/post-user-withdraw-request.dto';
import { DomainNameEnum } from 'src/constants/enum';
import { PostLoginOrSignUpRequestDto } from '../dtos/login-or-sign-up-request.dto';
import { PostLoginOrSignUpResponseDto } from '../dtos/login-or-sign-up-response.dto';
import { isDefined } from 'src/helpers/common.helper';

@Controller(DomainNameEnum.USER)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @summary 소셜로그인 API (+ 회원가입)
   * @author  Jason
   * @url     [POST] /api/v1/users/social-login
   * @returns { Promise<ResponseEntity<PostLoginOrSignUpResponseDto>> }
   */
  @Public()
  @Post('social-login')
  @HttpCode(HttpStatus.CREATED)
  async postLoginOrSignUp(
    @Body() body: PostLoginOrSignUpRequestDto,
  ): Promise<ResponseEntity<PostLoginOrSignUpResponseDto>> {
    const socialFactory = body.buildSocialFactory();

    const socialId = await socialFactory.validateSocialAccessToken();
    const user = await this.userService.findOneBySnsId(socialId);

    if (!isDefined(user)) {
      const signUpResult = await this.userService.createSignUp(
        socialFactory,
        body,
      );
      return ResponseEntity.OK_WITH(HttpStatus.CREATED, signUpResult);
    }
    const loginResult = await this.userService.createLogin(user, body.fcmToken);
    return ResponseEntity.OK_WITH(HttpStatus.CREATED, loginResult);
  }

  /**
   * @summary 토큰 재발급 API
   * @author  Jason
   * @url     [POST] /api/v1/users/token-refresh
   * @returns { Promise<ResponseEntity<TokenRefreshResponseDto>> }
   */
  @Public()
  @Post('token-refresh')
  @HttpCode(HttpStatus.CREATED)
  async postTokenRefresh(
    @Body() body: TokenRefreshRequestDto,
  ): Promise<ResponseEntity<TokenRefreshResponseDto>> {
    const result = await this.userService.createTokenRefresh(body.refreshToken);
    return ResponseEntity.OK_WITH(HttpStatus.CREATED, result);
  }

  /**
   * @summary 로그아웃 API
   * @author  Jason
   * @url     [POST] /api/v1/users/logout
   */
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async postLogout(@UserId() userId: number): Promise<void> {
    await this.userService.logout(userId);
  }

  /**
   * @summary 회원탈퇴 API
   * @author  Jason
   * @url     [POST] /api/v1/users/withdrawal
   */
  @Post('withdrawal')
  @HttpCode(HttpStatus.NO_CONTENT)
  async postWithdraw(
    @User() user: TDecodedUserToken,
    @Body() body: PostUserWithdrawRequestDto,
  ): Promise<void> {
    await this.userService.createWithdraw(user, body);
  }
}
