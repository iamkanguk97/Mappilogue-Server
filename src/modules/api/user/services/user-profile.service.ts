import { DataSource } from 'typeorm';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { PatchUserNicknameRequestDto } from '../dtos/request/patch-user-nickname-request.dto';
import { DecodedUserToken } from '../types';
import {
  ImageBuilderTypeEnum,
  MulterBuilder,
} from 'src/common/multer/multer.builder';
import { PatchUserProfileImageResponseDto } from '../dtos/response/patch-user-profile-image-response.dto';
import { UserAlarmSettingRepository } from '../repositories/user-alarm-setting.repository';
import { UserAlarmSettingDto } from '../dtos/user-alarm-setting.dto';
import { PutUserAlarmSettingRequestDto } from '../dtos/request/put-user-alarm-setting-request.dto';
import { isDefined } from 'src/helpers/common.helper';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { UserProfileHelper } from '../helpers/user-profile.helper';
import { UserHelper } from '../helpers/user.helper';

@Injectable()
export class UserProfileService {
  private readonly logger = new Logger(UserProfileService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly userHelper: UserHelper,
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
   * @param   { DecodedUserToken } user
   * @param   { Express.MulterS3.File[] | undefined } imageFiles
   * @returns { Promise<PatchUserProfileImageResponseDto> }
   */
  async modifyUserProfileImage(
    user: DecodedUserToken,
    imageFiles?: Express.MulterS3.File[] | undefined,
  ): Promise<PatchUserProfileImageResponseDto> {
    const [profileImageFile] = imageFiles || [];

    const updateProfileImageParam =
      this.userProfileHelper.setUpdateProfileImageParam(profileImageFile);

    const imageDeleteBuilder = new MulterBuilder(ImageBuilderTypeEnum.DELETE);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await Promise.all([
        this.userService.modifyById(
          user.id,
          updateProfileImageParam,
          queryRunner,
        ),
        imageDeleteBuilder.delete(user.profileImageKey),
      ]);

      return PatchUserProfileImageResponseDto.from(
        user.id,
        updateProfileImageParam.profileImageUrl,
      );
    } catch (err) {
      this.logger.error(`[modifyUserProfileImage - transacton error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @summary 사용자 알림 설정 조회 API Service
   * @author  Jason
   * @param   { number } userId
   * @returns { Promise<UserAlarmSettingDto> }
   */
  async findUserAlarmSettingById(userId: number): Promise<UserAlarmSettingDto> {
    const result = await this.userAlarmSettingRepository.findOne({
      where: this.userHelper.setUpdateUserCriteriaByUserId(userId),
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
    await this.userAlarmSettingRepository.update(
      this.userHelper.setUpdateUserCriteriaByUserId(userId),
      body.toEntity(),
    );
  }
}
