import { Module } from '@nestjs/common';
import { ColorController } from './controllers';
import { ColorService } from './services';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { ColorRepository } from './repositories';

@Module({
  imports: [CustomRepositoryModule.forCustomRepository([ColorRepository])],
  controllers: [ColorController],
  providers: [ColorService],
})
export class ColorModule {}
