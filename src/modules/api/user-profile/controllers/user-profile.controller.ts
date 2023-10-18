import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { User } from '../../user/decorators/user.decorator';
import { DecodedUserToken } from '../../user/types';
import { ResponseEntity } from 'src/common/response-entity';
import { decryptEmail } from 'src/helpers/crypt.helper';
import { UserId } from '../../user/decorators/user-id.decorator';
import { PatchUserNicknameRequestDto } from '../dtos/patch-user-nickname-request.dto';
import { UserProfileService } from '../services/user-profile.service';

@Controller('users/profiles')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getUserProfile(
    @User() user: DecodedUserToken,
  ): ResponseEntity<DecodedUserToken> {
    user.email = decryptEmail(user.email);
    return ResponseEntity.OK_WITH(HttpStatus.OK, user);
  }

  @Patch('nicknames')
  @HttpCode(HttpStatus.NO_CONTENT)
  async patchUserNickname(
    @UserId() userId: number,
    @Body() body: PatchUserNicknameRequestDto,
  ): Promise<void> {
    await this.userProfileService.updateUserNickname(userId, body);
  }

  @Patch('images')
  @HttpCode(HttpStatus.NO_CONTENT)
  async patchUserProfileImage() {
    return;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUserAlarmSetting(userId: number) {
    return;
  }
}
