import { Global, Module } from '@nestjs/common';
import { ColorModule } from './color/color.module';
import { UserModule } from './user/user.module';

@Global()
@Module({
  imports: [ColorModule, UserModule],
  exports: [ColorModule, UserModule],
})
export class ApiModule {}
