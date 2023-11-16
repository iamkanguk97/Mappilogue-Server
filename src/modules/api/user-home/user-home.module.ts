import { Module } from '@nestjs/common';
import { UserHomeController } from './controllers/user-home.controller';
import { UserHomeService } from './services/user-home.service';

@Module({
  imports: [],
  controllers: [UserHomeController],
  providers: [UserHomeService],
  exports: [UserHomeService],
})
export class UserHomeModule {}
