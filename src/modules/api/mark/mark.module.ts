import { Module } from '@nestjs/common';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { MarkRepository } from './repositories/mark.repository';
import { MarkController } from './controllers/mark.controller';
import { MarkService } from './services/mark.service';
import { MarkHelper } from './helpers/mark.helper';

@Module({
  imports: [CustomRepositoryModule.forCustomRepository([MarkRepository])],
  controllers: [MarkController],
  providers: [MarkService, MarkHelper],
  exports: [MarkHelper],
})
export class MarkModule {}
