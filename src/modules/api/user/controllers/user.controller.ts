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
import { TERMS_OF_SERVICE_URL } from 'src/constants';
import { TokenRefreshRequestDto } from '../dtos/token-refresh-request.dto';

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

    const user = await this.userService.findOneBySnsId(socialId);
    if (user == null) {
      // 회원가입 진행
      const result = await this.userService.signUp();
      return;
    }
    await this.userService.login();
    return;
  }

  @Post('token-refresh')
  @HttpCode(HttpStatus.CREATED)
  async tokenRefresh(@Body() body: TokenRefreshRequestDto) {
    return;
  }

  @Get('terms-of-service')
  @HttpCode(HttpStatus.OK)
  termsOfServiceUrl(): ResponseEntity<{ link: string }> {
    return ResponseEntity.OK_WITH(HttpStatus.OK, {
      link: TERMS_OF_SERVICE_URL,
    });
  }
}
