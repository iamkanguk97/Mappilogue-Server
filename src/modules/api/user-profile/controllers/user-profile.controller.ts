import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '../../user/decorators/user.decorator';
import { DecodedUserToken } from '../../user/types';
import { ResponseEntity } from 'src/common/response-entity';
import { decryptEmail } from 'src/helpers/crypt.helper';
import { UserId } from '../../user/decorators/user-id.decorator';
import { PatchUserNicknameRequestDto } from '../dtos/patch-user-nickname-request.dto';
import { UserProfileService } from '../services/user-profile.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProfileImageMulterOption } from 'src/common/multer/multer.option';
import { PatchUserProfileImageResponseDto } from '../dtos/patch-user-profile-image-response.dto';

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
    await this.userProfileService.modifyUserNickname(userId, body);
  }

  @UseInterceptors(
    FilesInterceptor('image', 1, CreateProfileImageMulterOption()),
  )
  @Patch('images')
  @HttpCode(HttpStatus.OK)
  async patchUserProfileImage(
    @User() user: DecodedUserToken,
    @UploadedFiles() imageFiles?: Express.MulterS3.File[] | undefined,
  ): Promise<ResponseEntity<PatchUserProfileImageResponseDto>> {
    const result = await this.userProfileService.modifyUserProfileImage(
      user,
      imageFiles,
    );
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUserAlarmSetting(userId: number) {
    return;
  }
}
