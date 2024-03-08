import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { PatchUserNicknameRequestDto } from '../dtos/request/patch-user-nickname-request.dto';
import { TDecodedUserToken } from '../types';
import {
  EImageBuilderType,
  MulterBuilder,
} from 'src/common/multer/multer.builder';
import { PatchUserProfileImageResponseDto } from '../dtos/response/patch-user-profile-image-response.dto';
import { UserAlarmSettingRepository } from '../repositories/user-alarm-setting.repository';
import { UserAlarmSettingDto } from '../dtos/user-alarm-setting.dto';
import { PutUserAlarmSettingRequestDto } from '../dtos/request/put-user-alarm-setting-request.dto';
import { isDefined } from 'src/helpers/common.helper';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { UserProfileHelper } from '../helpers/user-profile.helper';
import { PromiseStatusEnum } from 'src/constants/enum';

@Injectable()
export class UserProfileService {
  private readonly logger = new Logger(UserProfileService.name);

  constructor(
    private readonly userService: UserService,
    private readonly userProfileHelper: UserProfileHelper,
    private readonly userAlarmSettingRepository: UserAlarmSettingRepository,
  ) {}

  /**
   * @summary 닉네임 수정 API Service
   * @author  Jason
   * @param   { number } userId
   * @param   { PatchUserNicknameRequestDto } body
   */
  async modifyUserNickname(
    userId: number,
    body: PatchUserNicknameRequestDto,
  ): Promise<void> {
    await this.userService.modifyById(userId, body.toEntity(userId));
  }

  /**
   * @summary 프로필 이미지 수정 API Service
   * @author  Jason
   * @param   { TDecodedUserToken } user
   * @param   { Express.MulterS3.File } imageFile
   * @returns { Promise<PatchUserProfileImageResponseDto> }
   */
  async modifyUserProfileImage(
    user: TDecodedUserToken,
    imageFile?: Express.MulterS3.File,
  ): Promise<PatchUserProfileImageResponseDto> {
    const updateProfileImageParam =
      this.userProfileHelper.setUpdateProfileImageParam(imageFile);

    const imageDeleteBuilder = new MulterBuilder(EImageBuilderType.DELETE);

    const result = await Promise.allSettled([
      this.userService.modifyById(user.id, updateProfileImageParam),
      imageDeleteBuilder.delete(user.profileImageKey),
    ]);

    if (result[result.length - 1].status === PromiseStatusEnum.REJECTED) {
      /**
       * 이미지 삭제에서 에러가 발생할 때 어짜피 DB에는 새로운 프로필 이미지에 대한 정보가 저장되었을 것임.
       * 그렇기 때문에 여기에서는 단순히 개발자들에게 삭제에서 에러가 발생하는지 알려주기만 하면 됨.
       */
      this.logger.error(
        '[UserProfileService - modifyUserProfileImage] 이미지 삭제 오류 발생! --> 해결 필요',
      );
    }

    return PatchUserProfileImageResponseDto.from(
      user.id,
      updateProfileImageParam.profileImageUrl,
    );
  }

  /**
   * @summary 사용자 알림 설정 조회 API Service
   * @author  Jason
   * @param   { number } userId
   * @returns { Promise<UserAlarmSettingDto> }
   */
  async findUserAlarmSettingById(userId: number): Promise<UserAlarmSettingDto> {
    const result = await this.userAlarmSettingRepository.findOne({
      where: {
        userId,
      },
    });

    if (!isDefined(result)) {
      throw new BadRequestException(
        UserExceptionCode.GetUserAlarmSettingNotExist,
      );
    }

    return UserAlarmSettingDto.of(result);
  }

  /**
   * @summary 사용자 알림 설정 수정 API Service
   * @author  Jason
   * @param   { number } userId
   * @param   { PutUserAlarmSettingRequestDto } body
   */
  async modifyUserAlarmSetting(
    userId: number,
    body: PutUserAlarmSettingRequestDto,
  ): Promise<void> {
    await this.userAlarmSettingRepository.update({ userId }, body.toEntity());
  }
}
