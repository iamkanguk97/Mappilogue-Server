import { Module } from '@nestjs/common';
import { UserProfileController } from './controllers/user-profile.controller';
import { UserProfileService } from './services/user-profile.service';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/repositories/user.repository';
import { UserAlarmSettingRepository } from '../user/repositories/user-alarm-setting.repository';
import { UserProfileHelper } from './helpers/user-profile.helper';

@Module({
  imports: [
    UserModule,
    CustomRepositoryModule.forCustomRepository([
      UserRepository,
      UserAlarmSettingRepository,
    ]),
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService, UserProfileHelper],
  exports: [UserProfileService, UserProfileHelper],
})
export class UserProfileModule {}
