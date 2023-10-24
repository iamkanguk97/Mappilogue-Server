import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { LoginOrSignUpRequestDto } from '../dtos/login-or-sign-up-request.dto';
import { ResponseEntity } from 'src/common/response-entity';
import { UserService } from '../services/user.service';
import { TERMS_OF_SERVICE_URL } from 'src/constants/constant';
import { TokenRefreshRequestDto } from '../dtos/token-refresh-request.dto';
import * as _ from 'lodash';
import { TokenRefreshResponseDto } from '../dtos/token-refresh-response.dto';
import { LoginOrSignUpResponseDto } from '../dtos/login-or-sign-up-response.dto';
import { UserSocialFactory } from '../factories/user-social.factory';
import { Public } from 'src/modules/core/auth/decorators/auth.decorator';
import { UserId } from '../decorators/user-id.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('social-login')
  @HttpCode(HttpStatus.CREATED)
  async loginOrSignUp(
    @Body() body: LoginOrSignUpRequestDto,
  ): Promise<ResponseEntity<LoginOrSignUpResponseDto>> {
    const userSocialFactory = new UserSocialFactory(
      body.socialVendor,
      body.socialAccessToken,
    ).setSocialFactory();

    const socialId = await userSocialFactory.validateSocialAccessToken();
    const user = await this.userService.findOneBySnsId(socialId);
    if (_.isNil(user)) {
      const signUpResult = await this.userService.signUp(
        userSocialFactory,
        body.fcmToken,
      );
      return ResponseEntity.OK_WITH(HttpStatus.CREATED, signUpResult);
    }
    const loginResult = await this.userService.login(user, body.fcmToken);
    return ResponseEntity.OK_WITH(HttpStatus.CREATED, loginResult);
  }

  @Public()
  @Post('token-refresh')
  @HttpCode(HttpStatus.CREATED)
  async tokenRefresh(
    @Body() body: TokenRefreshRequestDto,
  ): Promise<ResponseEntity<TokenRefreshResponseDto>> {
    const result = await this.userService.tokenRefresh(body.refreshToken);
    return ResponseEntity.OK_WITH(HttpStatus.CREATED, result);
  }

  @Public()
  @Get('terms-of-service')
  @HttpCode(HttpStatus.OK)
  termsOfServiceUrl(): ResponseEntity<{ link: string }> {
    return ResponseEntity.OK_WITH(HttpStatus.OK, {
      link: TERMS_OF_SERVICE_URL,
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@UserId() userId: number): Promise<ResponseEntity<undefined>> {
    await this.userService.logout(userId);
    return ResponseEntity.OK(HttpStatus.OK);
  }

  async withdraw() {
    return;
  }
}
