import { isDefined } from 'src/helpers/common.helper';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '../decorators/user.decorator';
import { TDecodedUserToken } from '../types';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { decryptEmail } from 'src/helpers/crypt.helper';
import { UserId } from '../decorators/user-id.decorator';
import { PatchUserNicknameRequestDto } from '../dtos/request/patch-user-nickname-request.dto';
import { UserProfileService } from '../services/user-profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProfileImageMulterOption } from 'src/common/multer/multer.option';
import { PatchUserProfileImageResponseDto } from '../dtos/response/patch-user-profile-image-response.dto';
import { UserAlarmSettingDto } from '../dtos/user-alarm-setting.dto';
import { PutUserAlarmSettingRequestDto } from '../dtos/request/put-user-alarm-setting-request.dto';
import { Public } from 'src/modules/core/auth/decorators/auth.decorator';
import { TERMS_OF_SERVICE_URL } from 'src/constants/constant';
import { PATCH_USER_PROFILE_IMAGE_KEY } from '../variables/constants/user-profile.constant';
import { EDomainName } from 'src/constants/enum';

@Controller(EDomainName.USER_PROFILE)
@UseInterceptors(ClassSerializerInterceptor)
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  /**
   * @summary 사용자 프로필 조회 API
   * @author  Jason
   * @url     [GET] /api/v1/user-profiles
   * @returns { ResponseEntity<TDecodedUserToken> }
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  getUserProfile(
    @User() user: TDecodedUserToken,
  ): ResponseEntity<TDecodedUserToken> {
    if (isDefined(user.email)) {
      user.email = decryptEmail(user.email);
    }
    return ResponseEntity.OK_WITH(HttpStatus.OK, user);
  }

  /**
   * @summary 닉네임 수정 API
   * @author  Jason
   * @url     [PATCH] /api/v1/user-profiles/nicknames
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
   * @url     [PATCH] /api/v1/user-profiles/images
   * @returns { Promise<ResponseEntity<PatchUserProfileImageResponseDto>> }
   */
  @UseInterceptors(
    FileInterceptor(
      PATCH_USER_PROFILE_IMAGE_KEY,
      CreateProfileImageMulterOption(),
    ),
  )
  @Patch('images')
  @HttpCode(HttpStatus.OK)
  async patchUserProfileImage(
    @User() user: TDecodedUserToken,
    @UploadedFile() imageFile?: Express.MulterS3.File,
  ): Promise<ResponseEntity<PatchUserProfileImageResponseDto>> {
    const result = await this.userProfileService.modifyUserProfileImage(
      user,
      imageFile,
    );
    return ResponseEntity.OK_WITH(HttpStatus.OK, result);
  }

  /**
   * @summary 사용자 알림 설정 조회 API
   * @author  Jason
   * @url     [GET] /api/v1/user-profiles/alarm-settings
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
   * @url     [PUT] /api/v1/user-profiles/alarm-settings
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
   * @url     [GET] /api/v1/user-profiles/terms-of-services
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
