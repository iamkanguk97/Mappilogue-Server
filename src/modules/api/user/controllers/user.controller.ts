import { AuthService } from 'src/modules/core/auth/services/auth.service';
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
import { PostTokenRefreshRequestDto } from '../dtos/request/post-token-refresh-request.dto';
import { Public } from 'src/modules/core/auth/decorators/auth.decorator';
import { UserId } from '../decorators/user-id.decorator';
import { User } from '../decorators/user.decorator';
import { TDecodedUserToken } from '../types';
import { PostUserWithdrawRequestDto } from '../dtos/request/post-user-withdraw-request.dto';
import { DomainNameEnum } from 'src/constants/enum';
import { PostLoginOrSignUpRequestDto } from '../dtos/request/post-login-or-sign-up-request.dto';
import { PostLoginOrSignUpResponseDto } from '../dtos/response/post-login-or-sign-up-response.dto';
import { isDefined } from 'src/helpers/common.helper';
import { PostTokenRefreshResponseDto } from '../dtos/response/post-token-refresh-response.dto';
import { PostAutoLoginResponseDto } from '../dtos/response/post-auto-login-response.dto';

@Controller(DomainNameEnum.USER)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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
    const validateResult = await this.authService.validateSocialAccessToken(
      body,
    );
    const user = await this.userService.findOneBySnsId(validateResult.socialId);

    if (!isDefined(user)) {
      const signUpResult = await this.userService.createSignUp(
        body,
        validateResult,
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
   * @returns { Promise<ResponseEntity<PostTokenRefreshResponseDto>> }
   */
  @Public()
  @Post('token-refresh')
  @HttpCode(HttpStatus.CREATED)
  async postTokenRefresh(
    @Body() body: PostTokenRefreshRequestDto,
  ): Promise<ResponseEntity<PostTokenRefreshResponseDto>> {
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

  /**
   * @summary 자동로그인 API (스플래시 화면)
   * @author  Jason
   * @url     [POST] /api/v1/users/auto-login
   * @returns { ResponseEntity<PostAutoLoginResponseDto> }
   */
  @Post('auto-login')
  @HttpCode(HttpStatus.OK)
  postAutoLogin(
    @UserId() userId: number,
  ): ResponseEntity<PostAutoLoginResponseDto> {
    // AuthGuard에서 Access-Token에 대해서 유효성 검사 완료
    // 검사가 정상적으로 완료 되었으면 Controller로 넘어와서 OK Response를 보내줌
    return ResponseEntity.OK_WITH(
      HttpStatus.OK,
      PostAutoLoginResponseDto.of(userId),
    );
  }
}
