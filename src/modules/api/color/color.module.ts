import { Module } from '@nestjs/common';
import { ColorController } from './controllers/color.controller';
import { ColorService } from './services/color.service';

@Module({
  controllers: [ColorController],
  providers: [ColorService],
})
export class ColorModule {}
