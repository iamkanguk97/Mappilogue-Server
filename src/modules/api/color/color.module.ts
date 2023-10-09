import { Module } from '@nestjs/common';
import { ColorController } from './controllers/color.controller';
import { ColorService } from './services/color.service';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { ColorRepository } from './repositories/color.repository';

@Module({
  imports: [CustomRepositoryModule.forCustomRepository([ColorRepository])],
  controllers: [ColorController],
  providers: [ColorService],
})
export class ColorModule {}
