import { Module } from '@nestjs/common';
import { UserProfileController } from './controllers/user-profile.controller';
import { UserProfileService } from './services/user-profile.service';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { UserProfileRepository } from './repositories/user-profile.repository';

@Module({
  imports: [
    CustomRepositoryModule.forCustomRepository([UserProfileRepository]),
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
