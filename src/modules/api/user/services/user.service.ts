import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp() {
    return;
  }

  async login() {
    return;
  }

  async findOneBySnsId(socialId: string) {
    const result = await this.userRepository.selectUserBySnsId(socialId);
    console.log(result);
  }
}
