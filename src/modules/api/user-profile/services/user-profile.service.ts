import { DataSource } from 'typeorm';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
import { isDefined } from 'src/helpers/common.helper';

@Injectable()
export class UserProfileService {
  private readonly logger = new Logger(UserProfileService.name);

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
      this.logger.error(`[modifyUserProfileImage - transaction error] ${err}`);
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

  /**
   * - 사용자 알림은 회원가입 할 때 생성되고, 삭제되면 삭제된다.
   * - 회원탈퇴시 User 테이블에도 softDelete, 연결된 테이블에서도 softDelete
   * @param userId
   * @returns
   */
  async findUserAlarmSettingById(userId: number): Promise<UserAlarmSettingDto> {
    const result = await this.userAlarmSettingRepository.findOneOrFail({
      where: {
        userId,
      },
    });

    if (!isDefined(result)) {
      throw new BadRequestException('조회 결과가 없습니다.');
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
