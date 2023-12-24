import { UserHelper } from '../helpers/user.helper';
import { Module, forwardRef } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { UserRepository } from '../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtHelper } from 'src/modules/core/auth/helpers/jwt.helper';
import { UserAlarmSettingRepository } from '../repositories/user-alarm-setting.repository';
import { UserAlarmHistoryRepository } from '../repositories/user-alarm-history.repository';
import { UserWithdrawReasonRepository } from '../repositories/user-withdraw-reason.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserAlarmHistoryEntity } from '../entities/user-alarm-history.entity';
import { UserAlarmSettingEntity } from '../entities/user-alarm-setting.entity';
import { UserWithdrawReasonEntity } from '../entities/user-withdraw-reason.entity';
import { UserProfileModule } from './user-profile.module';

@Module({
  imports: [
    forwardRef(() => UserProfileModule),
    TypeOrmModule.forFeature([
      UserEntity,
      UserAlarmHistoryEntity,
      UserAlarmSettingEntity,
      UserWithdrawReasonEntity,
    ]),
    CustomRepositoryModule.forCustomRepository([
      UserRepository,
      UserAlarmSettingRepository,
      UserAlarmHistoryRepository,
      UserWithdrawReasonRepository,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserHelper, JwtService, JwtHelper],
  exports: [UserService, UserHelper],
})
export class UserModule {}
