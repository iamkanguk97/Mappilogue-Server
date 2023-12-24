import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '../decorators/user.decorator';
import { DecodedUserToken } from '../types';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { decryptEmail } from 'src/helpers/crypt.helper';
import { UserId } from '../decorators/user-id.decorator';
import { PatchUserNicknameRequestDto } from '../dtos/request/patch-user-nickname-request.dto';
import { UserProfileService } from '../services/user-profile.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProfileImageMulterOption } from 'src/common/multer/multer.option';
import { PatchUserProfileImageResponseDto } from '../dtos/response/patch-user-profile-image-response.dto';
import { UserAlarmSettingDto } from '../dtos/user-alarm-setting.dto';
import { PutUserAlarmSettingRequestDto } from '../dtos/request/put-user-alarm-setting-request.dto';
import { Public } from 'src/modules/core/auth/decorators/auth.decorator';
import { TERMS_OF_SERVICE_URL } from 'src/constants/constant';
import {
  PATCH_USER_PROFILE_IMAGE_KEY,
  PATCH_USER_PROFILE_IMAGE_LIMIT,
} from '../constants/user-profile.constant';
import { DomainNameEnum } from 'src/constants/enum';

@Controller(DomainNameEnum.USER_PROFILE)
@UseInterceptors(ClassSerializerInterceptor)
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  /**
   * @summary 사용자 프로필 조회 API
   * @author  Jason
   * @url     [GET] /api/v1/users/profiles
   * @returns { ResponseEntity<DecodedUserToken> }
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  getUserProfile(
    @User() user: DecodedUserToken,
  ): ResponseEntity<DecodedUserToken> {
    user.email = decryptEmail(user.email);
    return ResponseEntity.OK_WITH(HttpStatus.OK, user);
  }

  /**
   * @summary 닉네임 수정 API
   * @author  Jason
   * @url     [PATCH] /api/v1/users/profiles/nicknames
   */
  @Patch('nicknames')
  @HttpCode(HttpStatus.NO_CONTENT)
  async patchUserNickname(
    @UserId() userId: number,
    @Body() body: PatchUserNicknameRequestDto,
  ): Promise<void> {
    await this.userProfileService.modifyUserNickname(userId, body);
  }

  /**
   * @summary 프로필 이미지 수정 API
   * @author  Jason
   * @url     [PATCH] /api/v1/users/profiles/images
   * @returns { Promise<ResponseEntity<PatchUserProfileImageResponseDto>> }
   */
  @UseInterceptors(
    FilesInterceptor(
      PATCH_USER_PROFILE_IMAGE_KEY,
      PATCH_USER_PROFILE_IMAGE_LIMIT,
      CreateProfileImageMulterOption(),
    ),
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

  /**
   * @summary 사용자 알림 설정 조회 API
   * @author  Jason
   * @url     [GET] /api/v1/users/profiles/alarm-settings
   * @returns { Promise<ResponseEntity<UserAlarmSettingDto>> }
   */
  @Get('alarm-settings')
  @HttpCode(HttpStatus.OK)
  async getUserAlarmSetting(
    @UserId() userId: number,
  ): Promise<ResponseEntity<UserAlarmSettingDto>> {
    const result = await this.userProfileService.findUserAlarmSettingById(
      userId,
    );
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }

  /**
   * @summary 사용자 알림 설정 수정 API
   * @author  Jason
   * @url     [PUT] /api/v1/users/profiles/alarm-settings
   */
  @Put('alarm-settings')
  @HttpCode(HttpStatus.NO_CONTENT)
  async putUserAlarmSetting(
    @UserId() userId: number,
    @Body() body: PutUserAlarmSettingRequestDto,
  ): Promise<void> {
    await this.userProfileService.modifyUserAlarmSetting(userId, body);
  }

  /**
   * @summary 이용약관 조회 API
   * @author  Jason
   * @url     [GET] /api/v1/users/profiles/terms-of-services
   * @returns { ResponseEntity<{ link: string }> }
   */
  @Public()
  @Get('terms-of-services')
  @HttpCode(HttpStatus.OK)
  termsOfServiceUrl(): ResponseEntity<{ link: string }> {
    return ResponseEntity.OK_WITH(HttpStatus.OK, {
      link: TERMS_OF_SERVICE_URL,
    });
  }
}
