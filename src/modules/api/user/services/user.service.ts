import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOneBySnsId(socialId: string) {
    return await this.userRepository.findOne({
      where: {
        snsId: socialId,
      },
    });
  }
}
