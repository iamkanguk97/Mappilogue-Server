import { Module } from '@nestjs/common';
import { UserHomeService } from '../services/user-home.service';
import { UserHomeController } from '../controllers/user-home.controller';

@Module({
  imports: [],
  controllers: [UserHomeController],
  providers: [UserHomeService],
  exports: [UserHomeService],
})
export class UserHomeModule {}
