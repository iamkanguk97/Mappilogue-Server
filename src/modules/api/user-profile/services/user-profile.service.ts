import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { PatchUserNicknameRequestDto } from '../dtos/patch-user-nickname-request.dto';

@Injectable()
export class UserProfileService {
  constructor(private readonly userService: UserService) {}

  async modifyUserNickname(
    userId: number,
    body: PatchUserNicknameRequestDto,
  ): Promise<void> {
    await this.userService.modifyById(userId, body.toPartialUserEntity());
  }
}
