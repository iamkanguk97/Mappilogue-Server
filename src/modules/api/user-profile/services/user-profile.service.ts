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

@Injectable()
export class UserProfileService {
  constructor(private readonly userService: UserService) {}

  async updateUserNickname(
    userId: number,
    body: PatchUserNicknameRequestDto,
  ): Promise<void> {
    await this.userService.modifyById(userId, body.toPartialUserEntity());
  }

  async modifyUserProfileImage(
    user: DecodedUserToken,
    imageFiles: Express.MulterS3.File[],
  ): Promise<PatchUserProfileImageResponseDto> {
    console.log(imageFiles);
    const [profileImageFile] = imageFiles || [];

    const updateProfileImageParam = {
      profileImageUrl: profileImageFile?.location || USER_DEFAULT_PROFILE_IMAGE,
      profileImageKey: profileImageFile?.key || null,
    } as Partial<UserEntity>;

    console.log(updateProfileImageParam);

    const imageDeleteBuilder = new MulterBuilder(
      ImageBuilderTypeEnum.DELETE,
      user.id,
    );

    try {
      await Promise.all([
        this.userService.modifyById(user.id, updateProfileImageParam),
        imageDeleteBuilder.delete(user.profileImageKey),
      ]);
    } catch (err) {
      console.log(err);
      Logger.error(`[modifyUserProfileImage] ${err}`);
      throw err;
    }

    return PatchUserProfileImageResponseDto.from(
      user.id,
      updateProfileImageParam.profileImageUrl,
    );
  }
}
