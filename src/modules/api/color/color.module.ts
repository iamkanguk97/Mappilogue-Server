import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ColorController } from './controllers/color.controller';
import { ColorService } from './services/color.service';
import { CustomRepositoryModule } from 'src/modules/core/custom-repository/custom-repository.module';
import { ColorRepository } from './repositories/color.repository';
import { ColorEntity } from './entities/color.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ColorEntity]),
    CustomRepositoryModule.forCustomRepository([ColorRepository]),
  ],
  controllers: [ColorController],
  providers: [ColorService],
  exports: [ColorService],
})
export class ColorModule {}
