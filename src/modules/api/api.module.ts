import { Global, Module } from '@nestjs/common';
import { ColorModule } from './color/color.module';

@Global()
@Module({
  imports: [ColorModule],
  exports: [ColorModule],
})
export class ApiModule {}
