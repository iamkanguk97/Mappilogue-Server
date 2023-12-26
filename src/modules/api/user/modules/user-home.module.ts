import { Module } from '@nestjs/common';
import { UserHomeService } from '../services/user-home.service';
import { UserHomeController } from '../controllers/user-home.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementEntity } from '../entities/announcement.entity';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { AnnouncementRepository } from '../repositories/announcement.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnnouncementEntity]),
    CustomRepositoryModule.forCustomRepository([AnnouncementRepository]),
  ],
  controllers: [UserHomeController],
  providers: [UserHomeService],
  exports: [UserHomeService],
})
export class UserHomeModule {}
