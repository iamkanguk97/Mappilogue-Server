import { Module } from '@nestjs/common';
import { UserProfileController } from './controllers/user-profile.controller';
import { UserProfileService } from './services/user-profile.service';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/repositories/user.repository';

@Module({
  imports: [
    CustomRepositoryModule.forCustomRepository([UserRepository]),
    UserModule,
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}