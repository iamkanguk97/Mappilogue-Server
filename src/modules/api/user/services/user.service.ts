import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { AuthService } from 'src/modules/core/auth/services/auth.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async signUp() {
    return;
  }

  async login(user: UserEntity) {
    const result = await this.authService.setUserToken(user.id);
    console.log(result);
  }

  async findOneBySnsId(socialId: string): Promise<UserEntity> {
    return await this.userRepository.selectUserBySnsId(socialId);
  }
}
