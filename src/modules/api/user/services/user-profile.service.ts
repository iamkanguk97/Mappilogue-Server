import { DataSource } from 'typeorm';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { PatchUserNicknameRequestDto } from '../dtos/request/patch-user-nickname-request.dto';
import { DecodedUserToken } from '../types';
import {
  ImageBuilderTypeEnum,
  MulterBuilder,
} from 'src/common/multer/multer.builder';
import { UserEntity } from '../entities/user.entity';
import { PatchUserProfileImageResponseDto } from '../dtos/response/patch-user-profile-image-response.dto';
import { USER_DEFAULT_PROFILE_IMAGE } from '../constants/user.constant';
import { UserAlarmSettingRepository } from '../repositories/user-alarm-setting.repository';
import { UserAlarmSettingDto } from '../dtos/user-alarm-setting.dto';
import { PutUserAlarmSettingRequestDto } from '../dtos/put-user-alarm-setting-request.dto';
import { isDefined } from 'src/helpers/common.helper';
import { UserExceptionCode } from 'src/common/exception-code/user.exception-code';
import { UserProfileHelper } from '../helpers/user-profile.helper';

@Injectable()
export class UserProfileService {
  private readonly logger = new Logger(UserProfileService.name);

  constructor(
    private readonly dataSource: DataSource,
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
   * @param   { DecodedUserToken } user
   * @param   { Express.MulterS3.File[] | undefined } imageFiles
   * @returns { Promise<PatchUserProfileImageResponseDto> }
   */
  async modifyUserProfileImage(
    user: DecodedUserToken,
    imageFiles?: Express.MulterS3.File[] | undefined,
  ): Promise<PatchUserProfileImageResponseDto> {
    console.log(user);
    const [profileImageFile] = imageFiles || [];

    const updateProfileImageParam =
      this.userProfileHelper.setUpdateProfileImageParam(profileImageFile);

    console.log(updateProfileImageParam);

    const imageDeleteBuilder = new MulterBuilder(
      ImageBuilderTypeEnum.DELETE,
      user.id,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // await Promise.all([
      //   this.userService.modifyById(user.id, updateProfileImageParam),
      //   imageDeleteBuilder.delete(user.profileImageKey),
      // ]);

      await this.userService.modifyById(user.id, updateProfileImageParam);
      await imageDeleteBuilder.delete(user.profileImageKey);

      await queryRunner.commitTransaction();
      return PatchUserProfileImageResponseDto.from(
        user.id,
        updateProfileImageParam.profileImageUrl,
      );
    } catch (err) {
      console.log(err);
      this.logger.error(`[modifyUserProfileImage - transaction error] ${err}`);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

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

  async modifyUserAlarmSetting(
    userId: number,
    body: PutUserAlarmSettingRequestDto,
  ): Promise<void> {
    await this.userAlarmSettingRepository.update({ userId }, body.toEntity());
  }
}
