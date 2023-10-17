import { Controller, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common';

@Controller('users/profiles')
export class UserProfileController {
  @Get()
  @HttpCode(HttpStatus.OK)
  getUserProfile() {
    return;
  }

  @Patch('nicknames')
  @HttpCode(HttpStatus.NO_CONTENT)
  async patchUserNickname() {
    return;
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
