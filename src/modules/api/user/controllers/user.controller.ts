import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { LoginOrSignUpRequestDto } from '../dtos/login-or-sign-up-request.dto';
import { ResponseEntity } from 'src/entities/common/response.entity';
import { UserService } from '../services/user.service';
import { TokenRefreshRequestDto } from '../dtos/token-refresh-request.dto';
import * as _ from 'lodash';
import { TokenRefreshResponseDto } from '../dtos/token-refresh-response.dto';
import { LoginOrSignUpResponseDto } from '../dtos/login-or-sign-up-response.dto';
import { UserSocialFactory } from '../factories/user-social.factory';
import { Public } from 'src/modules/core/auth/decorators/auth.decorator';
import { UserId } from '../decorators/user-id.decorator';
import { TERMS_OF_SERVICE_URL } from 'src/constants/constant';
import { User } from '../decorators/user.decorator';
import { DecodedUserToken } from '../types';
import { PostUserWithdrawRequestDto } from '../dtos/post-user-withdraw-request.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('social-login')
  @HttpCode(HttpStatus.CREATED)
  async postLoginOrSignUp(
    @Body() body: LoginOrSignUpRequestDto,
  ): Promise<ResponseEntity<LoginOrSignUpResponseDto>> {
    const userSocialFactory = new UserSocialFactory(
      body.socialVendor,
      body.socialAccessToken,
    ).setSocialFactory();

    const socialId = await userSocialFactory.validateSocialAccessToken();
    const user = await this.userService.findOneBySnsId(socialId);

    if (_.isNil(user)) {
      const signUpResult = await this.userService.createSignUp(
        userSocialFactory,
        body,
      );
      return ResponseEntity.OK_WITH(HttpStatus.CREATED, signUpResult);
    }
    const loginResult = await this.userService.createLogin(user, body.fcmToken);
    return ResponseEntity.OK_WITH(HttpStatus.CREATED, loginResult);
  }

  @Public()
  @Post('token-refresh')
  @HttpCode(HttpStatus.CREATED)
  async postTokenRefresh(
    @Body() body: TokenRefreshRequestDto,
  ): Promise<ResponseEntity<TokenRefreshResponseDto>> {
    const result = await this.userService.createTokenRefresh(body.refreshToken);
    return ResponseEntity.OK_WITH(HttpStatus.CREATED, result);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@UserId() userId: number): Promise<void> {
    await this.userService.logout(userId);
  }

  @Post('withdrawal')
  @HttpCode(HttpStatus.NO_CONTENT)
  async postWithdraw(
    @User() user: DecodedUserToken,
    @Body() body: PostUserWithdrawRequestDto,
  ): Promise<void> {
    await this.userService.createWithdraw(user, body);
  }

  // @Get('homes')
  // @HttpCode(HttpStatus.OK)
  // async getHome(
  //   @UserId() userId: number,
  //   @Query() query: GetHomeOptionRequestDto,
  // ) {
  //   const result = await this.userService.findHome(userId, query.option);
  //   return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  // }

  termsOfServiceUrl(): ResponseEntity<{ link: string }> {
    return ResponseEntity.OK_WITH(HttpStatus.OK, {
      link: TERMS_OF_SERVICE_URL,
    });
  }
}
