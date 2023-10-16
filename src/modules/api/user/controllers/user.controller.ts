import { LoginOrSignUpEnum } from './../constants/user.enum';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { LoginOrSignUpRequestDto } from '../dtos/login-or-sign-up-request.dto';
import { AuthService } from 'src/modules/core/auth/services/auth.service';
import { ResponseEntity } from 'src/common/response-entity';
import { UserService } from '../services/user.service';
import { TERMS_OF_SERVICE_URL } from 'src/constants/constant';
import { TokenRefreshRequestDto } from '../dtos/token-refresh-request.dto';
import * as _ from 'lodash';
import { TokenRefreshResponseDto } from '../dtos/token-refresh-response.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('social-login')
  @HttpCode(HttpStatus.CREATED)
  async loginOrSignUp(
    @Body() body: LoginOrSignUpRequestDto,
  ): Promise<ResponseEntity<any>> {
    const socialId = await this.authService.validateSocialAccessToken(
      body.socialAccessToken,
      body.socialVendor,
    );

    console.log(socialId);
    const user = await this.userService.findOneBySnsId(socialId);
    console.log(user);
    if (_.isNil(user)) {
      // 회원가입 진행
      const signUpResult = await this.userService.signUp();
      return ResponseEntity.OK_WITH(HttpStatus.CREATED, {
        loginUserId: 1,
        type: LoginOrSignUpEnum.SIGNUP,
        accessToken: 'asdf',
        refreshToken: 'asdf',
      });
    }
    const loginResult = await this.userService.login(user);
    return ResponseEntity.OK_WITH(HttpStatus.CREATED, {
      loginUserId: user.id,
      type: LoginOrSignUpEnum.LOGIN,
      accessToken: 'asdf',
      refreshToken: 'asdf',
    });
  }

  @Post('token-refresh')
  @HttpCode(HttpStatus.CREATED)
  async tokenRefresh(
    @Body() body: TokenRefreshRequestDto,
  ): Promise<ResponseEntity<TokenRefreshResponseDto>> {
    const result = await this.userService.tokenRefresh(body.refreshToken);
    return ResponseEntity.OK_WITH(HttpStatus.CREATED, result);
  }

  @Get('terms-of-service')
  @HttpCode(HttpStatus.OK)
  termsOfServiceUrl(): ResponseEntity<{ link: string }> {
    return ResponseEntity.OK_WITH(HttpStatus.OK, {
      link: TERMS_OF_SERVICE_URL,
    });
  }

  // 로그아웃 API
  // 회원탈퇴 API
  // 알림설정 조회 API
  // 알림설정 수정 API
  // 프로필 조회 API
  // 닉네임 수정 API
  // 프로필 사진 수정 API
}
