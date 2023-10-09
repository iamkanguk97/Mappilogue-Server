import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthModule } from 'src/modules/core/auth/auth.module';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    CustomRepositoryModule.forCustomRepository([UserRepository]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
