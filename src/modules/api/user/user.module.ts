import { UserHelper } from './helpers/user.helper';
import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthModule } from 'src/modules/core/auth/auth.module';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { UserRepository } from './repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtHelper } from 'src/modules/core/auth/helpers/jwt.helper';
import { UserAlarmSettingRepository } from './repositories/user-alarm-setting.repository';
import { UserAlarmHistoryRepository } from './repositories/user-alarm-history.repository';

@Module({
  imports: [
    CustomRepositoryModule.forCustomRepository([
      UserRepository,
      UserAlarmSettingRepository,
      UserAlarmHistoryRepository,
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserHelper, JwtService, JwtHelper],
  exports: [UserService, UserHelper],
})
export class UserModule {}
