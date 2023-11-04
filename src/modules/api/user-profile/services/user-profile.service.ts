import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { PatchUserNicknameRequestDto } from '../dtos/patch-user-nickname-request.dto';
import { DecodedUserToken } from '../../user/types';
import {
  ImageBuilderTypeEnum,
  MulterBuilder,
} from 'src/common/multer/multer.builder';
import { UserEntity } from '../../user/entities/user.entity';
import { PatchUserProfileImageResponseDto } from '../dtos/patch-user-profile-image-response.dto';
import { USER_DEFAULT_PROFILE_IMAGE } from '../../user/constants/user.constant';
import { UserAlarmSettingRepository } from '../../user/repositories/user-alarm-setting.repository';
import { UserAlarmSettingDto } from '../../user/dtos/user-alarm-setting.dto';
import { PutUserAlarmSettingRequestDto } from '../dtos/put-user-alarm-setting-request.dto';
import { StatusColumnEnum } from 'src/constants/enum';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly userAlarmSettingRepository: UserAlarmSettingRepository,
  ) {}

  async modifyUserNickname(
    userId: number,
    body: PatchUserNicknameRequestDto,
  ): Promise<void> {
    await this.userService.modifyById(userId, { nickname: body.nickname });
  }

  async modifyUserProfileImage(
    user: DecodedUserToken,
    imageFiles: Express.MulterS3.File[],
  ): Promise<PatchUserProfileImageResponseDto> {
    const [profileImageFile] = imageFiles || [];

    const updateProfileImageParam = {
      profileImageUrl: profileImageFile?.location ?? USER_DEFAULT_PROFILE_IMAGE,
      profileImageKey: profileImageFile?.key ?? null,
    } as Partial<UserEntity>;

    const imageDeleteBuilder = new MulterBuilder(
      ImageBuilderTypeEnum.DELETE,
      user.id,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.userService.modifyById(user.id, updateProfileImageParam);
      await imageDeleteBuilder.delete(user.profileImageKey);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      Logger.error(`[modifyUserProfileImage] ${err}`);
      throw err;
    } finally {
      await queryRunner.release();
    }

    return PatchUserProfileImageResponseDto.from(
      user.id,
      updateProfileImageParam.profileImageUrl,
    );
  }

  async findUserAlarmSettingById(userId: number): Promise<UserAlarmSettingDto> {
    const result =
      await this.userAlarmSettingRepository.selectUserAlarmSettingById(userId);
    return UserAlarmSettingDto.from(userId, result);
  }

  async modifyUserAlarmSetting(
    userId: number,
    body: PutUserAlarmSettingRequestDto,
  ): Promise<void> {
    await this.userAlarmSettingRepository.update(
      { userId, status: StatusColumnEnum.ACTIVE },
      body.toEntity(),
    );
  }
}
